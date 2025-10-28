import { Request, Response } from 'express';
import NoteServices from '../services/noteServices';
import Controller from './controller';

class NoteController extends Controller {
  private noteService: NoteServices;

  constructor() {
    super(new NoteServices());
    this.noteService = new NoteServices();

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.uploadAudio = this.uploadAudio.bind(this);
    this.serveAudio = this.serveAudio.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, rawText, transcribedText, aiSummary, soapFormat } =
        req.body;

      const { code, note, message } = await this.noteService.createWithFile(
        patientId,
        rawText,
        transcribedText,
        aiSummary,
        soapFormat,
        req.file
      );

      if (!note) {
        res.status(code).json({ message });
        return;
      }

      res.status(code).json(note);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        rawText,
        transcribedText,
        aiSummary,
        noteType,
        audioFilePath,
        soapFormat,
      } = req.body;

      const { code, note, message } = await this.noteService.update(
        id,
        rawText,
        transcribedText,
        aiSummary,
        noteType,
        audioFilePath,
        soapFormat
      );

      if (!note) {
        res.status(code).json({ message });
        return;
      }

      res.status(code).json(note);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  async uploadAudio(req: Request, res: Response): Promise<void> {
    try {
      const { code, data, message } = await this.noteService.uploadAudioFile(
        req.file
      );

      if (!data) {
        res.status(code).json({ error: message });
        return;
      }

      res.status(code).json(data);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async serveAudio(req: Request, res: Response): Promise<void> {
    try {
      const filePath = req.params[0]; // Get everything after /audio/
      const { code, data, message } =
        await this.noteService.serveAudioFile(filePath);

      if (!data) {
        res.status(code).json({ error: message });
        return;
      }

      res.setHeader('Content-Type', data.mimeType);
      res.setHeader('Content-Length', data.fileSize);
      res.setHeader('Accept-Ranges', 'bytes');

      const fs = require('fs');
      const fileStream = fs.createReadStream(data.filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error: any) => {
        console.error('Error streaming file:', error);
        res.status(500).json({ error: 'Error streaming audio file' });
      });
    } catch (error) {
      console.error('Error serving audio file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default NoteController;
