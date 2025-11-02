// TypeScript types matching the backend API responses

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  patientId: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteType {
  TEXT: 'TEXT';
  AUDIO: 'AUDIO';
  MIXED: 'MIXED';
}

export type NoteTypeEnum = 'TEXT' | 'AUDIO' | 'MIXED';

export interface SOAPFormat {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

export interface Note {
  id: string;
  patientId: string;
  rawText?: string;
  transcribedText?: string;
  aiSummary?: string;
  noteType: NoteTypeEnum;
  audioFilePath?: string;
  soapFormat?: SOAPFormat;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    name: string;
    patientId: string;
    dateOfBirth: string;
  };
}

export interface ApiResponse<T> {
  code: number;
  data?: T;
  message?: string;
}
