if (!customElements.get('product-model')) {
  customElements.define('product-model', class ProductModel extends DeferredMedia {
    constructor() {
      super();
    }

    loadContent() {
      super.loadContent();

      Shopify.loadFeatures([
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: this.setupModelViewerUI.bind(this),
        },
      ]);
    }

    setupModelViewerUI(errors) {
      if (errors) return;

      this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));
    }
  });
}

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ]);
  },

  setupShopifyXR(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR()
      );
      return;
    }

    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
      modelJSON.remove();
    });
    window.ShopifyXR.setupXRElements();
  },
};

function initProductModel() {
  if (window.ProductModel) {
    console.log("🔄 Re-initializing ProductModel / ShopifyXR");
    window.ProductModel.loadShopifyXR();
  }
}

// Still run once on initial load
document.addEventListener('DOMContentLoaded', initProductModel);

// ✅ Also run again whenever sections reload
document.addEventListener('shopify:section:load', initProductModel);

// ✅ And run again after Barba transitions
if (window.barba && window.barba.hooks) {
  window.barba.hooks.after(initProductModel);
}
