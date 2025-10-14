
document.addEventListener('shopify:block:select', function(event) {
  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockSelectedIsSlide) return;

  const parentSlideshowComponent = event.target.closest('slideshow-component');
  parentSlideshowComponent.pause();

  setTimeout(function() {
    parentSlideshowComponent.slider.scrollTo({
      left: event.target.offsetLeft
    });
  }, 200);
});

document.addEventListener('shopify:block:deselect', function(event) {
  const blockDeselectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockDeselectedIsSlide) return;
  const parentSlideshowComponent = event.target.closest('slideshow-component');
  if (parentSlideshowComponent.autoplayButtonIsSetToPlay) parentSlideshowComponent.play();
});

document.addEventListener('shopify:section:load', () => {
  // 🔁 Re-run Zoom-on-Hover logic
  const zoomOnHoverScript = document.querySelector('[id^=EnableZoomOnHover]');
  if (zoomOnHoverScript) {
    const newScriptTag = document.createElement('script');
    newScriptTag.src = zoomOnHoverScript.src;
    zoomOnHoverScript.parentNode.replaceChild(newScriptTag, zoomOnHoverScript);
  }
});


function initAll() {
  // 🛒 Add-to-cart (example: rebind safely)
  const form = document.querySelector('form[action*="/cart/add"]');
  if (form) {
    const btn = form.querySelector('button[name="add"], [type="submit"][name="add"]');
    if (btn) {
      btn.removeEventListener('click', handleATC, { capture: true });
      btn.addEventListener('click', handleATC, { capture: true });
    }
  }

  // 📸 Product gallery/carousel re-init (adapt to your slider; example shows Swiper guard)
  document.querySelectorAll('.swiper, .swiper-container').forEach(el => {
    if (window.Swiper && !el.__swiper) {
      // new Swiper(el, { ...your options... });
    }
  });

  // ⭐ Judge.me (official reload trigger)
  if (window.jQuery && typeof jQuery(document).trigger === 'function') {
    jQuery(document).trigger('judgeme:reload');
  }

  // 🔁 Appstle (only if already loaded by the app)
  if (typeof window.appstleInit === 'function') {
    try { window.appstleInit(); } catch (e) { console.warn('Appstle re-init failed', e); }
  }
}

// Run on full page load
document.addEventListener('DOMContentLoaded', initAll);

// Run when Shopify sections are dynamically re-rendered
document.addEventListener('shopify:section:load', initAll);

// ✅ MOST IMPORTANT: hook into Barba so things re-init on PJAX transitions
if (window.barba && window.barba.hooks) {
  // after Barba swaps the DOM
  window.barba.hooks.after(() => {
    // let the DOM settle
    requestAnimationFrame(() => initAll());
  });
}


