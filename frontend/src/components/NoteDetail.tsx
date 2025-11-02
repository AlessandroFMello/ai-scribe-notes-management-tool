import { useState, useEffect } from 'react';
import { fetchNote } from '../services/api';
import type { Note } from '../types';

interface NoteDetailProps {
  noteId: string;
  onClose: () => void;
}

/**
 * Formats a date string to a readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats patient date of birth
 */
function formatDOB(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Gets audio URL from file path
 */
function getAudioUrl(audioFilePath: string): string {
  // Backend serves audio at /api/notes/audio/:filePath
  return `http://localhost:3000/api/notes/audio/${audioFilePath}`;
}

export default function NoteDetail({ noteId, onClose }: NoteDetailProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  async function loadNote() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNote(noteId);
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note');
      console.error('Error loading note:', err);
    } finally {
      setLoading(false);
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
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading note...</p>
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
          <h3 style={{ margin: '0 0 8px 0' }}>Error Loading Note</h3>
          <p style={{ margin: '0 0 16px 0' }}>{error}</p>
          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
          >
            <button
              onClick={loadNote}
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
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  const badgeColor =
    note.noteType === 'TEXT'
      ? '#3b82f6'
      : note.noteType === 'AUDIO'
      ? '#10b981'
      : '#f59e0b';

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header with Back Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          ← Back to Notes
        </button>
        <span
          style={{
            backgroundColor: badgeColor,
            color: 'white',
            padding: '6px 16px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          {note.noteType}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Main Content */}
        <div style={{ flex: '1', minWidth: 0 }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
              }}
            >
              Note Content
            </h2>

            {/* Raw Text */}
            {note.rawText && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Raw Text
                </h3>
                <p
                  style={{
                    margin: '0',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {note.rawText}
                </p>
              </div>
            )}

            {/* Transcribed Text */}
            {note.transcribedText && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Transcription
                </h3>
                <p
                  style={{
                    margin: '0',
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {note.transcribedText}
                </p>
              </div>
            )}

            {/* Audio Player */}
            {note.audioFilePath && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Audio Recording
                </h3>
                <audio
                  controls
                  src={getAudioUrl(note.audioFilePath)}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                  }}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* AI Summary */}
            {note.aiSummary && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  AI Summary
                </h3>
                <p
                  style={{
                    margin: '0',
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#374151',
                  }}
                >
                  {note.aiSummary}
                </p>
              </div>
            )}

            {/* SOAP Format */}
            {note.soapFormat && (
              <div>
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  SOAP Format
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {note.soapFormat.subjective && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#3b82f6',
                          textTransform: 'uppercase',
                        }}
                      >
                        Subjective
                      </h4>
                      <p
                        style={{
                          margin: '0',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#374151',
                        }}
                      >
                        {note.soapFormat.subjective}
                      </p>
                    </div>
                  )}
                  {note.soapFormat.objective && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#10b981',
                          textTransform: 'uppercase',
                        }}
                      >
                        Objective
                      </h4>
                      <p
                        style={{
                          margin: '0',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#374151',
                        }}
                      >
                        {note.soapFormat.objective}
                      </p>
                    </div>
                  )}
                  {note.soapFormat.assessment && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#f59e0b',
                          textTransform: 'uppercase',
                        }}
                      >
                        Assessment
                      </h4>
                      <p
                        style={{
                          margin: '0',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#374151',
                        }}
                      >
                        {note.soapFormat.assessment}
                      </p>
                    </div>
                  )}
                  {note.soapFormat.plan && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#8b5cf6',
                          textTransform: 'uppercase',
                        }}
                      >
                        Plan
                      </h4>
                      <p
                        style={{
                          margin: '0',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#374151',
                        }}
                      >
                        {note.soapFormat.plan}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb',
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              <p style={{ margin: '4px 0' }}>
                <strong>Created:</strong> {formatDate(note.createdAt)}
              </p>
              {note.updatedAt !== note.createdAt && (
                <p style={{ margin: '4px 0' }}>
                  <strong>Updated:</strong> {formatDate(note.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Patient Sidebar */}
        <div
          style={{
            width: '320px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            position: 'sticky',
            top: '24px',
          }}
        >
          <h2
            style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            Patient Information
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                border: '1px solid #bae6fd',
              }}
            >
              <p
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                {note.patient.name}
              </p>
              <p
                style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#6b7280',
                }}
              >
                {note.patient.patientId}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p
              style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
              }}
            >
              Date of Birth
            </p>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: '#374151',
              }}
            >
              {formatDOB(note.patient.dateOfBirth)}
            </p>
          </div>

          {/* Additional patient info would go here if available */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            <p style={{ margin: '0' }}>
              Patient ID: <strong>{note.patient.patientId}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
