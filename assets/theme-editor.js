
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
  console.log("🔄 initAll() running...");

  // 🛒 --- Reinitialize Shopify product form ---
  if (window.Shopify && window.Shopify.bind) {
    try {
      document.querySelectorAll('form[action*="/cart/add"]').forEach(form => {
        if (!form.hasAttribute('data-rebound')) {
          window.Shopify.bind(form);
          form.setAttribute('data-rebound', 'true');
        }
      });
    } catch (e) {
      console.warn("⚠️ Could not re-bind Shopify product form:", e);
    }
  }

  // 🖼️ --- Re-init image gallery (just in case) ---
  if (window.Swiper) {
    document.querySelectorAll('.swiper, .swiper-container').forEach(el => {
      if (!el.__swiper) {
        new Swiper(el, {
          loop: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      }
    });
  }

  // ⭐ --- Re-trigger Judge.me reviews ---
  if (window.jQuery && typeof jQuery(document).trigger === 'function') {
    jQuery(document).trigger('judgeme:reload');
  }

  // 🪄 --- Re-trigger Appstle ---
  if (typeof appstleInit === 'function') {
    try {
      appstleInit();
    } catch (e) {
      console.warn("⚠️ Appstle re-init error:", e);
    }
  }

  // 🪟 --- Fix flex layout reflow issues ---
  document.querySelectorAll('.flex-container').forEach(el => {
    el.style.display = 'flex';
  });

  console.log("✅ initAll complete.");
}

// Only run once now — no need for section load or Barba hooks
document.addEventListener('DOMContentLoaded', initAll);
