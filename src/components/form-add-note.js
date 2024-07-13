class FormAddNote extends HTMLElement {
  #_shadowRoot = null;
  #style = null;
  #submitEvent = 'submit';
  #addNoteEvent = 'addNote';
  #noteCount = 1;

  static #instanceCount = 0;

  constructor() {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');
    FormAddNote.#instanceCount++
    this.#render();
  }

  connectedCallback() {
    const form = this.#_shadowRoot.querySelector('form');
    const noteTitle = form.elements.noteTitle;
    const noteContent = form.elements.noteContent;

    form.addEventListener('submit', (event) => this.#onFormSubmit(event, this));
    this.addEventListener(this.#submitEvent, this.#onFormAddNoteSubmit);

    noteTitle.addEventListener('invalid', this.#onDataValidityCheckHandler);
    noteContent.addEventListener('invalid', this.#onDataValidityCheckHandler);

    noteTitle.addEventListener('blur', (event) => this.#onDataValidationMessageHandler(event, this));
    noteContent.addEventListener('blur', (event) => this.#onDataValidationMessageHandler(event, this));

    noteTitle.addEventListener('input', (event) => this.#onDataValidationMessageHandler(event, this));
    noteContent.addEventListener('input', (event) => this.#onDataValidationMessageHandler(event, this));
  }

  disconectedCallback() {
    const form = this.#_shadowRoot.querySelector('form');
    const noteTitle = form.elements.noteTitle;
    const noteContent = form.elements.noteContent;

    form.removeEventListener('submit', (event) => this.#onFormSubmit(event, this));
    this.removeEventListener(this.#submitEvent, this.#onFormAddNoteSubmit);

    noteTitle.removeEventListener('invalid', this.#onDataValidityCheckHandler);
    noteContent.removeEventListener('invalid', this.#onDataValidityCheckHandler);

    noteTitle.removeEventListener('blur', (event) => this.#onDataValidationMessageHandler(event, this));
    noteContent.removeEventListener('blur', (event) => this.#onDataValidationMessageHandler(event, this));

    noteTitle.addEventListener('input', (event) => this.#onDataValidationMessageHandler(event, this));
    noteContent.addEventListener('input', (event) => this.#onDataValidationMessageHandler(event, this));
  }

  #onDataValidityCheckHandler(event) {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Wajib diisi');
    }
  }

  #onDataValidationMessageHandler(event, addNoteFormInstance) {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationElement = connectedValidationId 
      ? addNoteFormInstance.#_shadowRoot.getElementById(connectedValidationId)
      : null;
    
    if (connectedValidationElement && errorMessage && !isValid) {
      connectedValidationElement.innerText = errorMessage;
    } else {
      connectedValidationElement.innerText = '';
    }
  }

  #onFormSubmit(event, formAddNoteInstance) {
    event.preventDefault();

    formAddNoteInstance.dispatchEvent(new CustomEvent('submit'));
  }

  #onFormAddNoteSubmit() {
    const title = this.#_shadowRoot.querySelector('input#noteTitle').value;
    const body = this.#_shadowRoot.querySelector('textarea#noteContent').value;
    const archived = this.#_shadowRoot.querySelector('input#toArchive').checked;

    const id = `form-add-note-${FormAddNote.#instanceCount}:${this.#noteCount++}`;
    const createdAt = new Date().toISOString();

    const query = {
      id,
      title,
      body,
      createdAt,
      archived,
    }

    this.dispatchEvent(
      new CustomEvent(this.#addNoteEvent, {
        detail: { query },
        bubbles: true,
      })
    );

    this.#clearForm();
  }

  #clearForm() {
    this.#_shadowRoot.querySelector('input#noteTitle').value = '';
    this.#_shadowRoot.querySelector('textarea#noteContent').value = '';
    this.#_shadowRoot.querySelector('input#toArchive').checked = false;
  }

  #updateStyle() {
    this.#style.textContent = `
      .form {
        display: grid;
        grid-template-columns: 1fr;

        gap: 16px;
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

      .input-text, .textarea {
        font-family: 'Poppins', sans-serif;
        border: 1px solid black;
        border-radius: 8px;
        font-size: 1.1em;
        padding: 8px;
      }

      .textarea {
        resize: vertical;
      }

      .validation-message {
        color: red;
        font-style: italic;
      }

      .checkbox {
        accent-color: var(--teal);
        width: 1.1em;
        height: 1.1em;
        vertical-align: text-top;
      }
    `;
  }

  #clearContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #render(){
    this.#updateStyle();
    this.#clearContent();

    this.#_shadowRoot.appendChild(this.#style);
    this.#_shadowRoot.innerHTML += `
      <form id="formAddNote" class="form">
        <div class="form-group form-group--style-vertical">
          <label for="noteTitle" class="label">Judul Catatan <span class="hint">(wajib)</span></label>
          <input 
            type="text" 
            id="noteTitle" 
            name="note-title" 
            class="input-text" 
            autocomplete="off" 
            required 
            maxlength="90"
            aria-describedby="noteTitleValidation"
          />
          <span id="noteTitleValidation" class="validation-message" aria-live="polite"></span>
        </div>
        <div class="form-group form-group--style-vertical">
          <label for="noteContent" class="label">Isi Catatan <span class="hint">(wajib)</span></label>
          <textarea 
            id="noteContent" 
            name="note-content" 
            autocomplete="off" 
            maxlength="1000" 
            rows="10" 
            class="textarea" 
            required
            aria-describedby="noteContentValidation"></textarea>
          <span id="noteContentValidation" class="validation-message" aria-live="polite"></span>
        </div>
        <div class="form-group">
          <label for="toArchive" class="label">Arsipkan</label>
          <input type="checkbox" name="toArchive" id="toArchive" value="toArchive" class="checkbox"/>
        </div>
        <button class="button">Simpan</button>
      </form>
    `;
  }
}

customElements.define('form-add-note', FormAddNote);