class FormFindNote extends HTMLElement {
  #_shadowRoot = null;
  #style = null;

  #submitEvent = 'submit';
  #searchEvent = 'search';

  constructor() {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');
    this.#render();
  }

  #onFormSubmitHandler(event, formFindNoteInstance) {
    event.preventDefault();

    formFindNoteInstance.dispatchEvent(new CustomEvent('submit'));
  }

  #onSearchBarSubmitHandler() {
    const query = this.#_shadowRoot.querySelector('input#searchNoteTitle').value;

    this.dispatchEvent(
      new CustomEvent(this.#searchEvent, {
        detail: { query },
        bubbles: true,
      }),
    );
  }

  connectedCallback() {
    const form = this.#_shadowRoot.querySelector('form');

    form.addEventListener('submit', (event) => this.#onFormSubmitHandler(event, this));
    this.addEventListener(this.#submitEvent, this.#onSearchBarSubmitHandler);
  }

  disconnectedCallbac() {
    const form = this.#_shadowRoot.querySelector('form');

    form.removeEventListener('submit', (event) => this.#onFormSubmitHandler(event, this));
    this.addEventListener(this.#submitEvent, this.#onSearchBarSubmitHandler);
  }

  #updateStyle() {
    this.#style.textContent = `
      .form {
        display: grid;
        grid-template-columns: 1fr;

        gap: 12px;
      }

      .form-group{
        &.form-group--style-vertical {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
      }

      .button{
        appearance: none;
        background-color: var(--blue-secondary);
        color: white;

        font-size: 1.2em;
        padding-block: 8px;

        border-radius: 8px;

        border: 1px double var(--blueish-grey)
      }

      .button:hover {
        background-color: var(--teal);
      }

      .label {
        color: var(--blue-primary);
        font-size: 1.1em;
      }

      .input-text {
        font-family: 'Poppins', sans-serif;
        border: 1px solid black;
        border-radius: 8px;
        font-size: 1.1em;
        padding: 8px;
      }
    `;
  }

  #clearContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #render() {
    this.#updateStyle();
    this.#clearContent();

    this.#_shadowRoot.appendChild(this.#style);
    this.#_shadowRoot.innerHTML += `
      <form id="formSearchNote" class="form">
        <div class="form-group form-group--style-vertical">
          <label for="searchNoteTitle" class="label">Judul Catatan <span class="hint">(untuk tampilkan semua, cari tanpa diisi)</span></label>
          <input type="text" id="searchNoteTitle" name="searchNoteTitle" class="input-text" maxlength="90"/>
        </div>
        <button class="button">Cari</button>
      </form>
    `;
  }
}

customElements.define('form-find-note', FormFindNote);