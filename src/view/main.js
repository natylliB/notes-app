import '../components/index.js';
import { getAllNotes } from '../data/local/notes-data.js';
import DicodingNotes from '../data/remote/dicoding-notes-api.js';
import Utils from '../Utils.js';


const addNoteFormElement = document.querySelector('form-add-note');
const findNoteFormElement = document.querySelector('form-find-note');
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
    Array.from(unarchiveNotesSection).forEach((element) => Utils.hideElement(element));
    showLoadingIndicator(unarchiveLoadingIndicator);
    const unarchiveNotes = await DicodingNotes.getNonarchiveNotes();

    const noteItemElements = unarchiveNotes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;

      noteItemElement.addEventListener('archive', onArchivingNote);
      noteItemElement.addEventListener('unarchive', onUnarchivingNote);
      
      return noteItemElement;
    });

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
    Array.from(archivedNotesSection).forEach((element) => Utils.hideElement(element));
    showLoadingIndicator(archivedLoadingIndicator);

    const archivedNotes = await DicodingNotes.getArchivedNotes();

    console.log(archivedNotes);

    const noteItemElements = archivedNotes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;

      noteItemElement.addEventListener('archive', onArchivingNote);
      noteItemElement.addEventListener('unarchive', onUnarchivingNote);

      console.log(noteItemElement);

      return noteItemElement;
    });

    console.log(noteItemElements);

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

const onArchivingNote = (event) => {
  event.preventDefault();

  const { query } = event.detail;

  console.log(`Archiving, Title: ${query.title}`);
}

const onUnarchivingNote = (event) => {
  event.preventDefault();

  const { query } = event.detail;

  console.log(`Removing from archive, Title: ${query.title}`);
}

const onAddNoteHandler = (event) => {
  event.preventDefault();

  const { query } = event.detail;

  console.log('Add Note: ', query);
}

const onSearchNoteHandler = (event) => {
  event.preventDefault();

  const { query } = event.detail;

  console.log('Find note: ', query);
}

addNoteFormElement.addEventListener('addNote', onAddNoteHandler);

findNoteFormElement.addEventListener('search', onSearchNoteHandler);

showAllNotes();