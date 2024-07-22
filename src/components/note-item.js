class NoteItem extends HTMLElement {
  #_shadowRoot = null;
  #style = null;
  #note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  #archiveEvent = 'archive';
  #unarchiveEvent = 'unarchive';

  constructor() {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');
  }

  set note(value) {
    this.#note = value;

    this.#render();
  }

  get note() {
    return this.#note;
  }

  #emptyContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #updateStyle() {
    this.#style.textContent = `
      .list-item {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content min-content 1fr min-content;

        align-items: stretch;

        &.list-item--style-card{
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          overflow: hidden;

          height: 100%;
        }

        & .list-item-title{
          background: linear-gradient(90deg, var(--blue-secondary), var(--blueish-grey));
          color: var(--blue-primary);
          padding-inline-start: 12px;

          margin: 0;
          padding-block: 12px;
        }

        & .list-item-description {
          padding-inline: 12px;
          color: var(--blue-primary);
        }
        
        & .list-item-creation-date {
          color: var(--blue-primary);
          background-color: var(--blueish-grey);
          padding-inline: 12px;
        }

        & .button-wrapper {
          padding: 8px;
          text-align: right;
        }

        & .button{
          appearance: none;
          background-color: var(--blue-secondary);
          color: white;

          font-size: 1em;
          padding-block: 8px;

          border-radius: 4px;

          border: 1px double var(--blue-secondary)
        }

        & .button:hover {
          background-color: var(--teal);
        }
      }
    `;
  }

  #render() {
    this.#updateStyle();
    this.#emptyContent();

    this.#_shadowRoot.appendChild(this.#style);
    
    // container
    const noteItemElm = document.createElement('div');
    noteItemElm.classList.add('list-item', 'list-item--style-card');

    // note title
    const noteItemTitleElm = document.createElement('h3');
    noteItemTitleElm.classList.add('list-item-title');
    noteItemTitleElm.innerText = this.note.title;

    // note creation date
    const noteItemCreateDateElm = document.createElement('div');
    noteItemCreateDateElm.classList.add('list-item-creation-date')

    const option = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }

    noteItemCreateDateElm.innerText = new Date(this.note.createdAt).toLocaleDateString('id-ID', option);

    // note body
    const noteItemBodyElm = document.createElement('div');
    noteItemBodyElm.classList.add('list-item-description');

    const noteItemBodyText = this.note.body.split('\n').join('<br/>');

    const p = document.createElement('p');
    p.innerHTML = noteItemBodyText;

    noteItemBodyElm.appendChild(p);

    //note archive button
    
    const button = document.createElement('button');
    button.classList.add('button');
    button.innerText = this.note.archived ? 'Keluarkan dari arsip' : 'Arsipkan';
    button.setAttribute('aria-label', this.note.archived ? 'unarchive' : 'archive');

    if (this.note.archived) {
      button.addEventListener('click', () => {this.#onButtonClickUnarchive(this)});
    } else {
      button.addEventListener('click', () => { this.#onButtonClickArchived(this)});
    }

    const buttonCasing = document.createElement('div');
    buttonCasing.classList.add('button-wrapper');

    buttonCasing.appendChild(button);

    noteItemElm.append(noteItemTitleElm, noteItemCreateDateElm, noteItemBodyElm, buttonCasing);

    this.#_shadowRoot.appendChild(noteItemElm);

  }

  #onButtonClickArchived(noteItemInstance) {
    const query = noteItemInstance.note.id;

    noteItemInstance.dispatchEvent(new CustomEvent(noteItemInstance.#archiveEvent, {
      detail: { query },
      bubbles: true,
    }));
  }

  #onButtonClickUnarchive(noteItemInstance) {
    const query = noteItemInstance.note.id;

    noteItemInstance.dispatchEvent(new CustomEvent(noteItemInstance.#unarchiveEvent, {
      detail: { query },
      bubbles: true,
    }));
  }
}

customElements.define('note-item', NoteItem);