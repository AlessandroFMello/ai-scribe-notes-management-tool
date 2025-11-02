import { useState } from 'react';
import { deleteNote } from '../services/api';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onClick?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
}

/**
 * Formats a date string to a readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Gets a preview text from the note
 */
function getPreview(note: Note): string {
  if (note.aiSummary) {
    return note.aiSummary.length > 100
      ? note.aiSummary.substring(0, 100) + '...'
      : note.aiSummary;
  }

  if (note.transcribedText) {
    return note.transcribedText.length > 100
      ? note.transcribedText.substring(0, 100) + '...'
      : note.transcribedText;
  }

  if (note.rawText) {
    return note.rawText.length > 100
      ? note.rawText.substring(0, 100) + '...'
      : note.rawText;
  }

  return 'No content available';
}

/**
 * Gets the badge color based on note type
 */
function getBadgeColor(noteType: string): string {
  switch (noteType) {
    case 'TEXT':
      return '#3b82f6'; // blue
    case 'AUDIO':
      return '#10b981'; // green
    case 'MIXED':
      return '#f59e0b'; // amber
    default:
      return '#6b7280'; // gray
  }
}

export default function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  const badgeColor = getBadgeColor(note.noteType);
  const preview = getPreview(note);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteNote(note.id);
      // Trigger refresh via parent callback
      if (onDelete) {
        onDelete(note.id);
      }
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Error deleting note:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete note');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        className="note-card"
        onClick={() => onClick?.(note.id)}
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
          }}
        >
          <div>
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
              }}
            >
              {note.patient.name}
            </h3>
            <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
              {note.patient.patientId} • {formatDate(note.createdAt)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                disabled={deleting}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                Delete
              </button>
            )}
            <span
              style={{
                backgroundColor: badgeColor,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'uppercase',
              }}
            >
              {note.noteType}
            </span>
          </div>
        </div>

        <p
          style={{
            margin: '0',
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.5',
          }}
        >
          {preview}
        </p>

        {onClick && (
          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: '12px',
              color: '#3b82f6',
              fontWeight: '500',
            }}
          >
            Click to view details →
          </p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => !deleting && setShowDeleteConfirm(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
              }}
            >
              Delete Note
            </h3>
            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}
            >
              Are you sure you want to delete this note? This action cannot be
              undone and will permanently remove the note from the system.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
