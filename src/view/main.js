import '../components/index.js';
import { getAllNotes } from '../notes-data.js';

const addNoteFormElement = document.querySelector('form-add-note');
const findNoteFormElement = document.querySelector('form-find-note');
const noteListElement= document.querySelector('note-list');

const showAllNotes = () => {
  const noteItemElements = getAllNotes().map((note) => {
    const noteItemElement = document.createElement('note-item');
    noteItemElement.note = note;

    noteItemElement.addEventListener('archive', onArchivingNote);
    noteItemElement.addEventListener('unarchive', onUnarchivingNote)

    return noteItemElement;
  });

  noteListElement.innerHTML = '';
  noteListElement.append(...noteItemElements);
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