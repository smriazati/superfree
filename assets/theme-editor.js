
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

function waitForAppstleInit(maxRetries = 30) {
  if (typeof appstleInit === 'function') {
    console.log("✅ Appstle is ready");
    appstleInit();
  } else if (maxRetries > 0) {
    setTimeout(() => waitForAppstleInit(maxRetries - 1), 200);
  } else {
    console.warn("⚠️ appstleInit was never defined");
  }
}

document.addEventListener('DOMContentLoaded', waitForAppstleInit);
document.addEventListener('shopify:section:load', waitForAppstleInit);

