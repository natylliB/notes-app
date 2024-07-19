class DicodingNotes {
  static #BASE_URL = 'https://notes-api.dicoding.dev/v2';

  static getNonarchiveNotes = async () => {
    try {
      const response = await fetch(`${DicodingNotes.#BASE_URL}/notes`);
      if(!response.ok) {
        throw new Error(`Response status: ${response.status}`);
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

  static getArchivedNotes = async() => {
    try {
      const response = await fetch(`${DicodingNotes.#BASE_URL}/notes/archived`);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
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
}

export default DicodingNotes;