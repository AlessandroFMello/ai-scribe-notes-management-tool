import prisma from '../models/connection';
import { FileUtils } from '../utils/fileUtils';

class NoteServices {
  private NOT_FOUND: string;

  constructor() {
    this.NOT_FOUND = 'Note not found.';

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.createWithFile = this.createWithFile.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.uploadAudioFile = this.uploadAudioFile.bind(this);
    this.serveAudioFile = this.serveAudioFile.bind(this);
  }

  async getAll(): Promise<{ code: number; data?: any; message?: string }> {
    try {
      const allNotes = await prisma.note.findMany({
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              patientId: true,
              dateOfBirth: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!allNotes || allNotes.length === 0) {
        return { code: 404, message: this.NOT_FOUND };
      }

      return { code: 200, data: allNotes };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error retrieving notes' };
    } finally {
      await prisma.$disconnect();
    }
  }

  async getById(
    id: string
  ): Promise<{ code: number; data?: any; message?: string }> {
    try {
      const note = await prisma.note.findUnique({
        where: { id },
        include: {
          patient: true,
        },
      });

      if (!note) {
        return { code: 404, message: this.NOT_FOUND };
      }

      return { code: 200, data: note };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error retrieving note' };
    } finally {
      await prisma.$disconnect();
    }
  }

  async create(
    patientId: string,
    rawText?: string,
    transcribedText?: string,
    aiSummary?: string,
    noteType: 'TEXT' | 'AUDIO' | 'MIXED' = 'TEXT',
    audioFilePath?: string,
    soapFormat?: any
  ): Promise<{ code: number; note?: any; message?: string }> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patient) {
        return { code: 404, message: 'Patient not found' };
      }

      const newNote = {
        patientId,
        rawText,
        transcribedText,
        aiSummary,
        noteType,
        audioFilePath,
        soapFormat,
      };

      const note = await prisma.note.create({
        data: newNote,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              patientId: true,
              dateOfBirth: true,
            },
          },
        },
      });

      if (!note) {
        return { code: 400, message: 'Failed to create note' };
      }

      return { code: 201, note };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error creating note' };
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(
    id: string,
    rawText?: string,
    transcribedText?: string,
    aiSummary?: string,
    noteType?: 'TEXT' | 'AUDIO' | 'MIXED',
    audioFilePath?: string,
    soapFormat?: any
  ): Promise<{ code: number; note?: any; message?: string }> {
    try {
      const existingNote = await prisma.note.findUnique({
        where: { id },
      });

      if (!existingNote) {
        return { code: 404, message: this.NOT_FOUND };
      }

      const updatedNote: any = {};

      if (rawText !== undefined) updatedNote.rawText = rawText;
      if (transcribedText !== undefined)
        updatedNote.transcribedText = transcribedText;
      if (aiSummary !== undefined) updatedNote.aiSummary = aiSummary;
      if (noteType !== undefined) updatedNote.noteType = noteType;
      if (audioFilePath !== undefined)
        updatedNote.audioFilePath = audioFilePath;
      if (soapFormat !== undefined) updatedNote.soapFormat = soapFormat;

      const note = await prisma.note.update({
        where: { id },
        data: updatedNote,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              patientId: true,
              dateOfBirth: true,
            },
          },
        },
      });

      if (!note) {
        return { code: 400, message: 'Failed to update note' };
      }

      return { code: 200, note };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error updating note' };
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete(id: string): Promise<{ code: number; message?: string }> {
    try {
      const existingNote = await prisma.note.findUnique({
        where: { id },
      });

      if (!existingNote) {
        return { code: 404, message: this.NOT_FOUND };
      }

      await prisma.note.delete({
        where: { id },
      });

      return { code: 200, message: 'Note deleted successfully' };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error deleting note' };
    } finally {
      await prisma.$disconnect();
    }
  }

  async createWithFile(
    patientId: string,
    rawText?: string,
    transcribedText?: string,
    aiSummary?: string,
    soapFormat?: any,
    file?: Express.Multer.File
  ): Promise<{ code: number; note?: any; message?: string }> {
    try {
      let audioFilePath: string | undefined;
      let noteType: 'TEXT' | 'AUDIO' | 'MIXED' = 'TEXT';

      if (file) {
        audioFilePath = FileUtils.getRelativePath(file.path);
        noteType = 'AUDIO';
      }

      if (file && rawText) {
        noteType = 'MIXED';
      }

      return await this.create(
        patientId,
        rawText,
        transcribedText,
        aiSummary,
        noteType,
        audioFilePath,
        soapFormat
      );
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error creating note with file' };
    }
  }

  async uploadAudioFile(
    file: Express.Multer.File
  ): Promise<{ code: number; data?: any; message?: string }> {
    try {
      if (!file) {
        return { code: 400, message: 'No audio file provided' };
      }

      const relativePath = FileUtils.getRelativePath(file.path);

      const responseData = {
        message: 'Audio file uploaded successfully',
        filePath: relativePath,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };

      return { code: 200, data: responseData };
    } catch (error) {
      console.error('Upload error:', error);
      return { code: 500, message: 'Internal server error' };
    }
  }

  async serveAudioFile(
    filePath: string
  ): Promise<{ code: number; data?: any; message?: string }> {
    try {
      const fullPath = FileUtils.getFullPath(filePath);

      if (!FileUtils.fileExists(fullPath)) {
        return { code: 404, message: 'Audio file not found' };
      }

      const ext = FileUtils.getFileExtension(fullPath);
      const mimeTypes: { [key: string]: string } = {
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.m4a': 'audio/mp4',
        '.aac': 'audio/aac',
        '.ogg': 'audio/ogg',
        '.webm': 'audio/webm',
      };

      const mimeType = mimeTypes[ext] || 'audio/mpeg';
      const fileSize = FileUtils.getFileSize(fullPath);

      const responseData = {
        filePath: fullPath,
        mimeType,
        fileSize,
        ext,
      };

      return { code: 200, data: responseData };
    } catch (error) {
      console.error('Error serving audio file:', error);
      return { code: 500, message: 'Internal server error' };
    }
  }
}

export default NoteServices;
