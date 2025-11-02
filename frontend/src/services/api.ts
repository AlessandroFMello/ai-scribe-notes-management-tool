import type { Note, Patient } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.PROD
  ? '/api'
  : 'http://localhost:3000/api';

/**
 * Fetches all notes from the API
 */
export async function fetchNotes(): Promise<Note[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Backend returns array directly OR wrapped in {code, data}
    if (Array.isArray(result)) {
      return result;
    }

    // Handle wrapped response format
    if (result.code === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to fetch notes');
  } catch (error) {
    console.error('Error fetching notes:', error);

    // Provide more helpful error messages
    if (
      error instanceof TypeError &&
      error.message.includes('Failed to fetch')
    ) {
      throw new Error(
        'Cannot connect to backend. Make sure the server is running on http://localhost:3000'
      );
    }

    throw error instanceof Error ? error : new Error('Failed to fetch notes');
  }
}

/**
 * Fetches a single note by ID
 */
export async function fetchNote(id: string): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Backend may return note directly OR wrapped in {code, data}
    if (result.id && result.patientId) {
      // Direct note object
      return result;
    }

    // Handle wrapped response format
    if (result.code === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to fetch note');
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
}

/**
 * Fetches all patients from the API
 */
export async function fetchPatients(): Promise<Patient[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Backend returns array directly OR wrapped in {code, data}
    if (Array.isArray(result)) {
      return result;
    }

    // Handle wrapped response format
    if (result.code === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to fetch patients');
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

/**
 * Creates a new note
 * @param patientId - ID of the patient (required)
 * @param rawText - Optional text content
 * @param audioFile - Optional audio file
 */
export async function createNote(
  patientId: string,
  rawText?: string,
  audioFile?: File
): Promise<Note> {
  try {
    const formData = new FormData();
    formData.append('patientId', patientId);

    if (rawText) {
      formData.append('rawText', rawText);
    }

    if (audioFile) {
      formData.append('audioFile', audioFile);
    }

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    // Backend may return note directly OR wrapped in {code, data}
    if (result.id && result.patientId) {
      // Direct note object
      return result;
    }

    // Handle wrapped response format
    if (result.code === 200 && result.note) {
      return result.note;
    }

    if (result.code === 201 && result.note) {
      return result.note;
    }

    throw new Error(result.message || 'Failed to create note');
  } catch (error) {
    console.error('Error creating note:', error);
    throw error instanceof Error ? error : new Error('Failed to create note');
  }
}
