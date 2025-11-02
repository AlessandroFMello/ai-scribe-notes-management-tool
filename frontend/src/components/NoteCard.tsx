import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onClick?: (noteId: string) => void;
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

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const badgeColor = getBadgeColor(note.noteType);
  const preview = getPreview(note);

  return (
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            {note.patient.name}
          </h3>
          <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
            {note.patient.patientId} • {formatDate(note.createdAt)}
          </p>
        </div>
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
        <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#3b82f6', fontWeight: '500' }}>
          Click to view details →
        </p>
      )}
    </div>
  );
}

