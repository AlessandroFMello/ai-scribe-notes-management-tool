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
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        patientId,
        rawText,
        transcribedText,
        aiSummary,
        noteType,
        audioFilePath,
        soapFormat,
      } = req.body;

      const { code, note, message } = await this.noteService.create(
        patientId,
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
}

export default NoteController;
