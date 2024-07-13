class SectionWithTitle extends HTMLElement {
  #_shadowRoot = null;
  #style = null;
  #sectionTitle = '"title" attribute required!'
  #sectionCardStyle = false;

  static get observedAttributes() {
    return [ 'title', 'card-style' ];
  }

  constructor() {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');

    const title = this.getAttribute('title');

    if (title) {
      this.sectionTitle = title;
    }

    if (this.hasAttribute('card-style')) {
      this.sectionCardStyle = true;
    } else {
      this.sectionCardStyle = false;
    }

    this.#render();
  }

  get sectionTitle() {
    return this.#sectionTitle;
  }

  set sectionTitle(value) {
    this.#sectionTitle = value;
  }

  get sectionCardStyle() {
    return this.#sectionCardStyle;
  }

  set sectionCardStyle(value) {
    this.#sectionCardStyle = value
  }

  #clearContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #updateStyle() {
    this.#style.textContent = `
      :host {
        width: 85%;
        padding: 0;
      }

      .section {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        
        &.section--style-card{
          padding: 16px;
        
          border-radius: 8px;

          box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        }
      }
    `;
  }

  #render() {
    this.#updateStyle();
    this.#clearContent();

    this.#_shadowRoot.appendChild(this.#style);
    this.#_shadowRoot.innerHTML += `
      <section class="section ${this.sectionCardStyle ? 'section--style-card' : ''}">
        <custom-header header-context="section">${this.sectionTitle}</custom-header>  
        <slot>Need to add content inside the section-with-title element.</slot>
      </section>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'title':
        this.sectionTitle = newValue;
        break;
      case 'card-style':
        this.sectionCardStyle = newValue !== null ? true : false;
    }
    this.#render();
  }
}

customElements.define('section-with-title', SectionWithTitle);