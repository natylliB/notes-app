class NoteList extends HTMLElement {
  #_shadowRoot = null;
  #style = null;

  constructor() {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');
    
    this.#render();
  }

  #clearContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #updateStyle() {
    this.#style.textContent = `
      .list-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px
      }

      @media screen and (min-width: 600px) {
        .list-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media screen and (min-width: 1100px) {
        .list-container {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media screen and (min-width: 1400px) {
        .list-container{
          width: 95%;
          margin-inline: auto;

          grid-template-columns: repeat(4, 1fr);
        }
      }
      
    `;
  }

  #render() {
    this.#updateStyle();
    this.#clearContent();

    this.#_shadowRoot.appendChild(this.#style);
    this.#_shadowRoot.innerHTML += `
      <div class="list-container">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('note-list', NoteList);