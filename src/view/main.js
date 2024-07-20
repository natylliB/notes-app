import '../components/index.js';
import DicodingNotes from '../data/remote/dicoding-notes-api.js';
import Utils from '../Utils.js';
import Swal from 'sweetalert2';

const main = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const addNoteFormElement = document.querySelector('form-add-note');
    const unarchiveNoteListElement = document.querySelector('note-list#unarchive');
    const archivedNoteListElement = document.querySelector('note-list#archived');
    const unarchiveLoadingIndicator = document.querySelector('#unarchiveLoadingIndicator');
    const archivedLoadingIndicator = document.querySelector('#archivedLoadingIndicator');
    const unarchiveNotesSection = document.querySelector('section-with-title#unarchiveNotes');
    const archivedNotesSection = document.querySelector('section-with-title#archivedNotes');

    const PopupError = Swal.mixin({
      title: "Error",
      icon: 'error'
    });

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

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
        PopupError.fire({ text: error });
        
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
        PopupError.fire({ text: error });

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
        PopupError.fire({ text: error });
      }
    }

    const unarchivingNoteHandler = async (event) => {
      try {
        event.preventDefault();
      
        const { query } = event.detail;
      
        await DicodingNotes.unarchiveNote(query);

        showAllNotes();

      } catch (error) {
        PopupError.fire({ text: error });
      }
    }

    const addNoteHandler = async (event) => {
      try {
        event.preventDefault();
  
        const { query } = event.detail;
  
        await DicodingNotes.createNote(query);

        Toast.fire({
          icon: 'success',
          title: 'Berhasil tambah catatan',
        });

        showAllNotes();
      } catch (error) {
        PopupError.fire({ text: error });
      }
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

