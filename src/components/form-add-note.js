class FormAddNote extends HTMLElement {
  #_shadowRoot = null;
  #style = null;
  #addNoteEvent = 'addNote';

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

    form.addEventListener('submit', this.#onFormSubmitHandler);
    
    noteTitle.addEventListener('invalid', this.#onInvalidSetCustomValidityHandler);
    noteContent.addEventListener('invalid', this.#onInvalidSetCustomValidityHandler);

    noteTitle.addEventListener('blur', this.#onDataValidationMessageHandler);
    noteContent.addEventListener('blur', this.#onDataValidationMessageHandler);

    noteTitle.addEventListener('input', this.#onDataValidationMessageHandler);
    noteContent.addEventListener('input', this.#onDataValidationMessageHandler);
  }

  disconnectedCallback() {
    const form = this.#_shadowRoot.querySelector('form');
    const noteTitle = form.elements.noteTitle;
    const noteContent = form.elements.noteContent;

    form.removeEventListener('submit', this.#onFormSubmitHandler);
    
    noteTitle.removeEventListener('invalid', this.#onInvalidSetCustomValidityHandler);
    noteContent.removeEventListener('invalid', this.#onInvalidSetCustomValidityHandler);

    noteTitle.removeEventListener('blur', this.#onDataValidationMessageHandler);
    noteContent.removeEventListener('blur', this.#onDataValidationMessageHandler);

    noteTitle.removeEventListener('input', this.#onDataValidationMessageHandler);
    noteContent.removeEventListener('input', this.#onDataValidationMessageHandler);
  }

  #onInvalidSetCustomValidityHandler = (event) => {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Wajib diisi');
    }
  }

  #onDataValidationMessageHandler = (event) => {
    event.target.checkValidity();

    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationElement = connectedValidationId 
      ? this.#_shadowRoot.getElementById(connectedValidationId)
      : null;
    
    if (connectedValidationElement && errorMessage && !isValid) {
      connectedValidationElement.innerText = errorMessage;
    } else {
      connectedValidationElement.innerText = '';
    }
  }

  #onFormSubmitHandler = (event) => {
    event.preventDefault();

    if (!(event.target instanceof HTMLFormElement)) {
      throw new Error ('Form submit handler must be used on an HTMLFormElement.');
    }

    const title = event.target.noteTitle.value;
    const body = event.target.noteContent.value;

    const query = {
      title,
      body,
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
        <button class="button">Simpan</button>
      </form>
    `;
  }
}

customElements.define('form-add-note', FormAddNote);