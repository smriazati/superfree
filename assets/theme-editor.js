
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

  if (typeof initProductModel === 'function') initProductModel();

  // 🖼️ --- Re-init image gallery / slideshow ---
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
  } else {
    console.log("⚠️ Swiper not detected — skipping gallery init");
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
  } else {
    waitForAppstleInit();
  }

  // 🧩 --- Re-trigger Shopify Sections (layout fixes) ---
  if (window.Shopify && Shopify.designMode) {
    document.dispatchEvent(new CustomEvent('shopify:section:load'));
  }

  // 🪟 --- Fix flex layout reflow issues ---
  document.querySelectorAll('.flex-container').forEach(el => {
    el.style.display = 'flex';
  });

  console.log("✅ initAll complete.");
}

// ⏱️ Helper: wait for Appstle if not ready yet
function waitForAppstleInit(retries = 20) {
  if (typeof appstleInit === 'function') {
    appstleInit();
  } else if (retries > 0) {
    setTimeout(() => waitForAppstleInit(retries - 1), 300);
  }
}

// 📍 Listen for all the important events
document.addEventListener('DOMContentLoaded', initAll);
document.addEventListener('shopify:section:load', initAll);
if (window.barba && window.barba.hooks) {
  window.barba.hooks.after(() => {
    console.log("📦 Barba transition finished — re-initializing...");
    setTimeout(initAll, 200);
  });
}
