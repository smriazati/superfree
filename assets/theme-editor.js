
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

  // 🛒 Re-initialize Add to Cart button
  setupAddToCartButton?.();

  // 📸 Re-initialize product carousel
  initProductCarousel?.();

  // ⭐️ Re-initialize Judge.me reviews
  if (window.jQuery && typeof jQuery(document).trigger === 'function') {
    jQuery(document).trigger('judgeme:reload');
  }

  // 🧩 Re-run any custom layout fixes
  recalculateFlexLayouts?.();
});

function safeAppstleInit(maxRetries = 40) {
  const productForm = document.querySelector('form[action*="/cart/add"]');
  const subscriptionEl = document.querySelector('[id*="appstle-"]');

  // ✅ Only run if the product form AND the appstle elements exist
  if (typeof appstleInit === 'function' && productForm) {
    console.log("✅ Appstle initialized after section load");
    appstleInit();
  } else if (maxRetries > 0) {
    console.log("⏳ Waiting for Appstle...");
    setTimeout(() => safeAppstleInit(maxRetries - 1), 300);
  } else {
    console.warn("⚠️ Appstle still not ready after waiting");
  }
}

document.addEventListener('DOMContentLoaded', safeAppstleInit);
document.addEventListener('shopify:section:load', safeAppstleInit);
