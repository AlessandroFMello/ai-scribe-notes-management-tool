import { useState, useEffect } from 'react';
import { fetchPatients } from '../services/api';
import type { Patient } from '../types';

interface PatientSelectorProps {
  value?: string;
  onChange?: (patientId: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function PatientSelector({
  value,
  onChange,
  required = false,
  disabled = false,
}: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedPatientId = e.target.value;
    onChange?.(selectedPatientId);
  }

  if (error) {
    return (
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          Patient {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '14px',
          }}
        >
          <p style={{ margin: '0 0 8px 0' }}>Error loading patients: {error}</p>
          <button
            onClick={loadPatients}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
        }}
        htmlFor="patient-select"
      >
        Patient {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <select
        id="patient-select"
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || loading}
        required={required}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: loading || disabled ? '#f9fafb' : '#ffffff',
          color: loading || disabled ? '#9ca3af' : '#111827',
          cursor: loading || disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.outline = 'none';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
      >
        {loading ? (
          <option value="">Loading patients...</option>
        ) : (
          <>
            <option value="">
              {required ? 'Select a patient...' : 'All patients (optional)'}
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.patientId})
              </option>
            ))}
          </>
        )}
      </select>
      {loading && (
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          Loading patients...
        </p>
      )}
    </div>
  );
}

