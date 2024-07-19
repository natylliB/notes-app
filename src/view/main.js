import '../components/index.js';
import DicodingNotes from '../data/remote/dicoding-notes-api.js';
import Utils from '../Utils.js';

const main = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const addNoteFormElement = document.querySelector('form-add-note');
    const unarchiveNoteListElement = document.querySelector('note-list#unarchive');
    const archivedNoteListElement = document.querySelector('note-list#archived');
    const unarchiveLoadingIndicator = document.querySelector('#unarchiveLoadingIndicator');
    const archivedLoadingIndicator = document.querySelector('#archivedLoadingIndicator');
    const unarchiveNotesSection = document.querySelector('section-with-title#unarchiveNotes');
    const archivedNotesSection = document.querySelector('section-with-title#archivedNotes');

    const showAllNotes = () => {
      showUnarchivedNotes();
      showArchivedNotes();
    }

    const showUnarchivedNotes = async () => {
      try {
        Utils.hideElementsIn(unarchiveNotesSection);

        showLoadingIndicator(unarchiveLoadingIndicator);

        const unarchiveNotes = await DicodingNotes.getNonarchiveNotes();

        const noteItemElements = createNoteItemElements(unarchiveNotes);

        Utils.clearElement(unarchiveNoteListElement);

        unarchiveNoteListElement.append(...noteItemElements);

        hideLoadingIndicator(unarchiveLoadingIndicator);

        Utils.showElement(unarchiveNoteListElement);
      } catch (error) {
        console.error(error);
        
        hideLoadingIndicator(unarchiveLoadingIndicator);
      }
    }

    const showArchivedNotes = async() => {
      try {
        Utils.hideElementsIn(archivedNotesSection);

        showLoadingIndicator(archivedLoadingIndicator);

        const archivedNotes = await DicodingNotes.getArchivedNotes();

        const noteItemElements = createNoteItemElements(archivedNotes);

        Utils.clearElement(archivedNoteListElement);

        archivedNoteListElement.append(...noteItemElements);

        hideLoadingIndicator(archivedLoadingIndicator);

        Utils.showElement(archivedNoteListElement);
      } catch (error) {
        console.error(error);

        hideLoadingIndicator(archivedLoadingIndicator);
      }
    }

    const showLoadingIndicator = (loadingElement) => {
      Utils.showElement(loadingElement);
    }

    const hideLoadingIndicator = (loadingElement) => {
      Utils.hideElement(loadingElement);
    }

    const archivingNoteHandler = async (event) => {
      try {
        event.preventDefault();
      
        const { query } = event.detail;
      
        await DicodingNotes.archiveNote(query);

        showAllNotes();

      } catch (error) {
        console.error(error);
      }
    }

    const unarchivingNoteHandler = async (event) => {
      try {
        event.preventDefault();
      
        const { query } = event.detail;
      
        await DicodingNotes.unarchiveNote(query);

        showAllNotes();

      } catch (error) {
        console.error(error);
      }
    }

    const addNoteHandler = async (event) => {
      event.preventDefault();

      const { query } = event.detail;

      await DicodingNotes.createNote(query);

      showAllNotes();
    }

    const createNoteItemElements = (notes) => {
      const noteItemElements = notes.map((note) => {
        const noteItemElement = document.createElement('note-item');
        noteItemElement.note = note;

        noteItemElement.addEventListener('archive', archivingNoteHandler);
        noteItemElement.addEventListener('unarchive', unarchivingNoteHandler);

        return noteItemElement;
      });

      return noteItemElements;
    }

    addNoteFormElement.addEventListener('addNote', addNoteHandler);

    showAllNotes();
  });
}

export default main;

