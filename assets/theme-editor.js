
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
  console.log("🔄 initAll() called — reinitializing key features...");

  // 🛒 Re-bind Add-to-Cart button (optional safeguard)
  const productForm = document.querySelector('form[action*="/cart/add"]');
  if (productForm) {
    const atcButton = productForm.querySelector('button[name="add"]');
    if (atcButton) {
      atcButton.removeEventListener('click', handleATC);
      atcButton.addEventListener('click', handleATC);
    }
  }

  // ⭐️ Re-trigger Judge.me reviews if present
  if (window.jQuery && typeof jQuery(document).trigger === 'function') {
    jQuery(document).trigger('judgeme:reload');
  }

  // 📸 Re-initialize Swiper or product gallery if needed
  if (window.Swiper) {
    document.querySelectorAll('.swiper, .swiper-container').forEach(el => {
      if (!el.__swiper) {
        // Example: uncomment and adjust options if needed
        // new Swiper(el, { loop: true });
      }
    });
  }

  // 🪄 Safely initialize Appstle if available
  if (typeof appstleInit === 'function') {
    try {
      console.log("✅ Calling appstleInit()");
      appstleInit();
    } catch (err) {
      console.warn("⚠️ Appstle initialization failed:", err);
    }
  } else {
    console.warn("⚠️ appstleInit is still undefined, retrying...");
    waitForAppstleInit();
  }
}

// ⏱️ Fallback: Wait for Appstle to load if not defined yet
function waitForAppstleInit(retries = 20) {
  if (typeof appstleInit === 'function') {
    console.log("✅ appstleInit became available — initializing...");
    appstleInit();
  } else if (retries > 0) {
    setTimeout(() => waitForAppstleInit(retries - 1), 300);
  } else {
    console.warn("❌ appstleInit still not defined after waiting.");
  }
}

// 📍 Run on initial page load
document.addEventListener('DOMContentLoaded', initAll);

// 📍 Re-run whenever Shopify reloads a section (e.g. product page)
document.addEventListener('shopify:section:load', initAll);

// 📍 Re-run after PJAX / Barba page transitions
if (window.barba && window.barba.hooks) {
  window.barba.hooks.after(() => {
    console.log("📦 Barba page transition complete — reinitializing...");
    requestAnimationFrame(initAll);
  });
}

// 📍 Safety net: MutationObserver (optional, but useful for edge cases)
const mo = new MutationObserver(() => {
  if (document.querySelector('[id*="appstle-"]')) {
    initAll();
  }
});
mo.observe(document.body, { childList: true, subtree: true });
