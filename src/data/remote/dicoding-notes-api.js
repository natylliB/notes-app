class DicodingNotes {
  static #BASE_URL = 'https://notes-api.dicoding.dev/v2';

  static getNonarchiveNotes = async () => {
    try {
      const response = await fetch(`${DicodingNotes.#BASE_URL}/notes`);
      if(!response.ok) {
        throw new Error(`Response status: ${response.status} ${response.statusText}`);
      }
      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        return responseJson.data;
      }

      throw new Error(responseJson.message);
    } catch(error) {
      console.error(error.message);
    }
  }

  static getArchivedNotes = async () => {
    try {
      const response = await fetch(`${DicodingNotes.#BASE_URL}/notes/archived`);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} ${response.statusText}`);
      }

      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        return responseJson.data;
      }

      throw new Error(responseJson.message);
    } catch(error) {
      console.error(error.message);
    }
  }

  static createNote = async (note) => {
    try {
      const response = await fetch(`${DicodingNotes.#BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        throw new Error (`Response status: ${response.status} ${response.statusText}`);
      }

      const responseJson = await response.json();

      return responseJson.message;
    } catch (error) {
      console.error(error);
    }
  }

  static archiveNote = async (noteId) => {
    try {
      const response = await fetch(`${DicodingNotes.#BASE_URL}/notes/${noteId}/archive`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} ${response.statusText}`);
      }

      const responseJson = await response.json();

      return responseJson.message;
    } catch (error) {
      console.error(error);
    }
  }

  static unarchiveNote = async (noteId) => {
    try {
      const response = await fetch(`${DicodingNotes.#BASE_URL}/notes/${noteId}/unarchive`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} ${response.statusText}`);
      }

      const responseJson = await response.json();

      return responseJson.message;
    } catch (error) {
      console.error(error);
    }
  }
}

export default DicodingNotes;