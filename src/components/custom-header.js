class CustomHeader extends HTMLElement {
  #_shadowRoot = null;
  #style = null;
  #headerContext = 'app';

  static get observedAttributes() {
    return [ 'header-context' ];
  }

  constructor() {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');

    const headerContext = this.getAttribute('header-context');

    if (headerContext === 'app' || headerContext === 'section') {
      this.#headerContext = headerContext;
    } else {
      this.setAttribute('header-context', 'app');
    }

    this.#render();
  }

  #clearContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #updateStyle() {
    this.#style.textContent = `
      .header {
        &.header--context-app {
          padding: 8px;
        }
      }

      .heading {
        color: var(--blue-primary);
        &.heading--type-h1{
          text-align: center;
          margin: 0;
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

    switch (this.#headerContext) {
      case 'app': 
        this.#_shadowRoot.innerHTML += this.#appHeaderTemplate();
        break;
      case 'section':
        this.#_shadowRoot.innerHTML += this.#sectionHeaderTemplate();
        break;
    }
  }

  #appHeaderTemplate() {
    return `
      <header class="header header--context-app">
        <h1 class="heading heading--type-h1">
          <slot>Header Title required, place your header inside custom-header element!</slot>
        </h1>
      </header>
      <hr class="hr"/>
    `;
  }

  #sectionHeaderTemplate() {
    return `
      <header class=header header--context-section>
        <h2 class="heading heading--type-h2"><slot>Header Title required, place your header inside custom-header element!</slot></h2>
        <hr class="hr"/>
      </header>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'header-context') {
      switch(newValue) {
        case 'app': 
          this.#headerContext = 'app';
          break;
        case 'section':
          this.#headerContext = 'section';
          break;
        default: 
          console.error('Attribute value incorrect. set either "app" or "section" as header-context attribute\'s value.');
          this.setAttribute('header-context', oldValue);
      }

      this.#render();
    }
  }
}

customElements.define('custom-header', CustomHeader);