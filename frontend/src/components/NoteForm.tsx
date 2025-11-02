import { useState, useEffect } from 'react';
import { createNote } from '../services/api';
import PatientSelector from './PatientSelector';
import type { Note } from '../types';

interface NoteFormProps {
  onSuccess?: (note: Note) => void;
  onCancel?: () => void;
}

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [patientId, setPatientId] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/m4a',
        'audio/aac',
        'audio/ogg',
        'audio/webm',
      ];
      const validExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (
        !validTypes.includes(file.type) &&
        !validExtensions.includes(fileExtension)
      ) {
        setError(
          'Invalid file type. Please upload an audio file (mp3, wav, m4a, aac, ogg, webm)'
        );
        e.target.value = '';
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size exceeds 10MB limit');
        e.target.value = '';
        return;
      }

      setAudioFile(file);
      setError(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!patientId) {
      setError('Please select a patient');
      return;
    }

    if (!rawText && !audioFile) {
      setError('Please provide either text or an audio file');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    createNote(patientId, rawText || undefined, audioFile || undefined)
      .then((note) => {
        setSuccess(true);
        // Reset form
        setPatientId('');
        setRawText('');
        setAudioFile(null);

        // Call success callback
        if (onSuccess) {
          onSuccess(note);
        }

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      })
      .catch((err) => {
        setError(err.message || 'Failed to create note');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleReset() {
    setPatientId('');
    setRawText('');
    setAudioFile(null);
    setError(null);
    setSuccess(false);
    setIsOpen(false);
    if (onCancel) {
      onCancel();
    }
  }

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  // Close accordion on successful note creation
  useEffect(() => {
    if (success && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, isOpen]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Accordion Header */}
      <div
        onClick={handleToggle}
        style={{
          padding: '16px 24px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isOpen ? '#f9fafb' : '#ffffff',
          borderBottom: isOpen ? '1px solid #e5e7eb' : 'none',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        <h2
          style={{
            margin: '0',
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
          }}
        >
          Create New Note
        </h2>
        <span
          style={{
            fontSize: '20px',
            color: '#6b7280',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          ▼
        </span>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px',
          }}
        >

      {/* Patient Selector */}
      <div style={{ marginBottom: '20px' }}>
        <PatientSelector
          value={patientId}
          onChange={setPatientId}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Text Input */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
          }}
          htmlFor="note-text"
        >
          Note Text (Optional)
        </label>
        <textarea
          id="note-text"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          disabled={isSubmitting}
          placeholder="Enter clinical note text here..."
          rows={6}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontFamily: 'inherit',
            resize: 'vertical',
            minHeight: '120px',
            backgroundColor: isSubmitting ? '#f9fafb' : '#ffffff',
            color: isSubmitting ? '#9ca3af' : '#111827',
          }}
        />
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          {rawText.length} characters
        </p>
      </div>

      {/* Audio File Upload */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
          }}
          htmlFor="audio-file"
        >
          Audio File (Optional)
        </label>
        <input
          id="audio-file"
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
          onChange={handleFileChange}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: isSubmitting ? '#f9fafb' : '#ffffff',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        />
        {audioFile && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px 12px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <strong>Selected:</strong> {audioFile.name} (
            {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          Supported formats: MP3, WAV, M4A, AAC, OGG, WEBM (Max 10MB)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '6px',
            color: '#065f46',
            fontSize: '14px',
          }}
        >
          ✅ Note created successfully! Processing with AI...
        </div>
      )}

      {/* Form Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: '#374151',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !patientId || (!rawText && !audioFile)}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            borderRadius: '6px',
            backgroundColor:
              isSubmitting || !patientId || (!rawText && !audioFile)
                ? '#d1d5db'
                : '#3b82f6',
            color: '#ffffff',
            cursor:
              isSubmitting || !patientId || (!rawText && !audioFile)
                ? 'not-allowed'
                : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {isSubmitting ? 'Creating Note...' : 'Create Note'}
        </button>
      </div>
        </form>
      )}
    </div>
  );
}
