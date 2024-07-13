class CustomFooter extends HTMLElement {
  #_shadowRoot = null;
  #style = null;
  #footerContext = 'app';

  static get observedAttributes() {
    return [ 'footer-context' ];
  }

  constructor() {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');

    if (this.getAttribute('footer-context') !== 'app') {
      this.setAttribute('footer-context', 'app');
    } else {
      this.#footerContext = this.getAttribute('footer-context');
    }

    this.#render();
  }

  #clearContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #updateStyle() {
    this.#style.textContent = `
      .footer {
        &.footer--context-app {
          color: var(--blue-primary);
          text-align: center;
          padding-block: 16px;
        }
      }

      .hr {
        border: 1px solid var(--blue-primary);
        width: 100%;
      }
    `;
  }

  #render() {
    this.#updateStyle();
    this.#clearContent();

    this.#_shadowRoot.appendChild(this.#style);

    if (this.#footerContext === 'app') {
      this.#_shadowRoot.innerHTML += this.#appFooterContext();
    }


  }

  #appFooterContext() {
    return `
      <hr class="hr"/>
      <footer class="footer footer--context-app">
        <slot>Footer Text Needed</slot>
      </footer>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'footer-context':
        if (newValue !== 'app') {
          console.error('Attribute value incorrect. Currently custom-footer only accept app as footer-context attribute\'s value.');
          this.setAttribute('footer-context', 'app');
          this.#render();
        }
    }
  }
}

customElements.define('custom-footer', CustomFooter);