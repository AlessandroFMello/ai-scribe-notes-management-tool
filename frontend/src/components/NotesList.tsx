import { useState, useEffect } from 'react';
import { fetchNotes, fetchPatients } from '../services/api';
import type { Note, Patient } from '../types';
import NoteCard from './NoteCard';

interface NotesListProps {
  refreshTrigger?: number; // Use this to trigger refresh (instead of React's special 'key' prop)
  onNoteClick?: (noteId: string) => void;
}

export default function NotesList({
  refreshTrigger,
  onNoteClick,
}: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  useEffect(() => {
    // Filter notes by selected patient
    if (selectedPatientId === '') {
      setNotes(allNotes);
    } else {
      setNotes(allNotes.filter((note) => note.patientId === selectedPatientId));
    }
  }, [selectedPatientId, allNotes]);

  async function loadNotes() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotes();
      setAllNotes(data);
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPatients() {
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  }

  function handleNoteClick(noteId: string) {
    // Navigate to note detail view - handled by parent
    if (onNoteClick) {
      onNoteClick(noteId);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div
          style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '20px',
            color: '#991b1b',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>Error Loading Notes</h3>
          <p style={{ margin: '0 0 16px 0' }}>{error}</p>
          <button
            onClick={loadNotes}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (notes.length === 0 && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          {selectedPatientId ? 'No notes found for selected patient' : 'No notes found'}
        </p>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          {selectedPatientId
            ? 'Try selecting a different patient or create a new note'
            : 'Create your first note to get started'}
        </p>
        {selectedPatientId && (
          <button
            onClick={() => setSelectedPatientId('')}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Show All Notes
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <h1
            style={{
              margin: '0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
            }}
          >
            Clinical Notes
          </h1>
          
          {/* Patient Filter */}
          <div style={{ minWidth: '200px' }}>
            <label
              htmlFor="patient-filter"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
              }}
            >
              Filter by Patient
            </label>
            <select
              id="patient-filter"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              <option value="">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.patientId})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          {selectedPatientId && notes.length !== allNotes.length && (
            <span style={{ color: '#9ca3af' }}>
              {' '}(of {allNotes.length} total)
            </span>
          )}
        </div>
      </div>

      <div>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onClick={handleNoteClick} />
        ))}
      </div>
    </div>
  );
}
