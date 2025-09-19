// atc-guard.js
(function () {
  var REENABLE_AFTER_MS = 3000; // wait ~3s before helping
  var SELECTOR = 'form[action^="/cart"] [type="submit"][name="add"]';

  function getAddButton() {
    return document.querySelector(SELECTOR);
  }
  function variantSelected() {
    // Most themes keep the selected variant id in a hidden input named "id"
    var idInput = document.querySelector('form[action^="/cart"] input[name="id"]');
    return !!(idInput && idInput.value);
  }
  function looksSoldOut() {
    // Be conservative: if the button says "Sold out" or the form has a sold-out flag, do nothing
    var btn = getAddButton();
    if (!btn) return false;
    var txt = (btn.textContent || '').toLowerCase();
    if (txt.includes('sold out') || txt.includes('sold-out')) return true;
    var form = btn.closest('form');
    return !!(form && (form.dataset.soldOut === 'true' || form.classList?.contains('sold-out')));
  }
  function enableButton(btn) {
    btn.removeAttribute('disabled');
    btn.classList.remove('disabled', 'is-disabled', 'btn--disabled', 'opacity-50');
    btn.setAttribute('aria-disabled', 'false');
  }

  function guard() {
    var btn = getAddButton();
    if (!btn) return;

    var lastSeenEnabledAt = Date.now();

    function check() {
      // If button is present and not disabled, update timestamp
      var isDisabled = btn.hasAttribute('disabled') || btn.classList.contains('is-disabled');
      if (!isDisabled) {
        lastSeenEnabledAt = Date.now();
        return;
      }
      // Only help if shopper picked a variant and it doesn't look like a real sold-out case
      if (!variantSelected() || looksSoldOut()) return;

      var stuckFor = Date.now() - lastSeenEnabledAt;
      if (stuckFor > REENABLE_AFTER_MS) {
        enableButton(btn);
        lastSeenEnabledAt = Date.now();
      }
    }

    // Watch for changes to the button (some apps swap/disable it)
    var observer = new MutationObserver(check);
    observer.observe(btn, { attributes: true, attributeFilter: ['disabled', 'class', 'aria-disabled'] });

    // Also poll every second to catch cases where the node is replaced
    setInterval(function () {
      var freshBtn = getAddButton();
      if (freshBtn && freshBtn !== btn) {
        btn = freshBtn;
        observer.disconnect();
        observer = new MutationObserver(check);
        observer.observe(btn, { attributes: true, attributeFilter: ['disabled', 'class', 'aria-disabled'] });
      }
      check();
    }, 1000);
  }

  document.addEventListener('DOMContentLoaded', guard);
})();
