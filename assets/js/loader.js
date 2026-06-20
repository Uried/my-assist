/**
 * Loader module for MyAssist
 * Manages loading states during data fetching
 */

const Loader = {
  overlay: null,
  textElement: null,

  /**
   * Initialize the loader
   */
  init() {
    // Create loader overlay if it doesn't exist
    if (!document.querySelector('.loader-overlay')) {
      this.createLoader();
    }
    
    this.overlay = document.querySelector('.loader-overlay');
    this.textElement = this.overlay.querySelector('.loader-text');
  },

  /**
   * Create the loader HTML structure
   */
  createLoader() {
    const overlay = document.createElement('div');
    overlay.className = 'loader-overlay';
    overlay.innerHTML = `
      <div class="loader">
        <div class="loader-spinner"></div>
        <div class="loader-text">Chargement...</div>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  /**
   * Show the loader
   * @param {string} text - Optional text to display
   */
  show(text = 'Chargement...') {
    if (!this.overlay) {
      this.init();
    }
    
    if (this.textElement) {
      this.textElement.textContent = text;
    }
    
    this.overlay.classList.add('active');
  },

  /**
   * Hide the loader
   */
  hide() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
  },

  /**
   * Show loader with async operation
   * @param {Promise} promise - The async operation to wait for
   * @param {string} text - Optional text to display
   * @returns {Promise} - The result of the async operation
   */
  async withLoading(promise, text = 'Chargement...') {
    this.show(text);
    try {
      const result = await promise;
      return result;
    } finally {
      this.hide();
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Loader.init());
} else {
  Loader.init();
}
