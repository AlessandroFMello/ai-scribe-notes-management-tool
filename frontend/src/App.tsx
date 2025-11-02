import { useState } from 'react';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';
import NoteDetail from './components/NoteDetail';
import type { Note } from './types';
import './index.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  function handleNoteCreated(note: Note) {
    // Trigger refresh of notes list
    setRefreshKey((prev) => prev + 1);
    console.log('Note created:', note);
  }

  function handleNoteClick(noteId: string) {
    setSelectedNoteId(noteId);
  }

  function handleCloseDetail() {
    setSelectedNoteId(null);
  }

  function handleNoteDeleted() {
    setRefreshKey((prev) => prev + 1);
    setSelectedNoteId(null);
  }

  function handleNoteDeletedFromList() {
    setRefreshKey((prev) => prev + 1);
  }

  if (selectedNoteId) {
    return (
      <div className="app">
        <header
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '20px 0',
            marginBottom: '32px',
          }}
        >
          <div className="container">
            <h1
              style={{
                margin: '0',
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
              }}
            >
              AI Scribe Notes Management
            </h1>
            <p
              style={{
                margin: '8px 0 0 0',
                color: '#6b7280',
                fontSize: '14px',
              }}
            >
              Manage clinical notes with AI-powered transcription and summaries
            </p>
          </div>
        </header>

        <main className="container">
          <NoteDetail
            noteId={selectedNoteId}
            onClose={handleCloseDetail}
            onNoteDeleted={handleNoteDeleted}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 0',
          marginBottom: '32px',
        }}
      >
        <div className="container">
          <h1
            style={{
              margin: '0',
              fontSize: '28px',
              fontWeight: '700',
              color: '#111827',
            }}
          >
            AI Scribe Notes Management
          </h1>
          <p
            style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}
          >
            Manage clinical notes with AI-powered transcription and summaries
          </p>
        </div>
      </header>

      <main className="container">
        <div style={{ marginBottom: '32px' }}>
          <NoteForm onSuccess={handleNoteCreated} />
        </div>

        <NotesList
          refreshTrigger={refreshKey}
          onNoteClick={handleNoteClick}
          onNoteDeleted={handleNoteDeletedFromList}
        />
      </main>
    </div>
  );
}

export default App;
