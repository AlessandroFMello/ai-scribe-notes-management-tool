import { Request, Response } from "express";
import NoteServices from "../services/noteServices";
import Controller from "./controller";
import { FileUtils } from "../utils/fileUtils";

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
      const {
        patientId,
        rawText,
        transcribedText,
        aiSummary,
        noteType,
        soapFormat,
      } = req.body;

      let audioFilePath: string | undefined;
      if (req.file) {
        audioFilePath = FileUtils.getRelativePath(req.file.path);
      }

      const { code, note, message } = await this.noteService.create(
        patientId,
        rawText,
        transcribedText,
        aiSummary,
        noteType || (req.file ? "AUDIO" : "TEXT"),
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
      res.status(500).json({ message: "Internal server error." });
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
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async uploadAudio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No audio file provided" });
        return;
      }

      const relativePath = FileUtils.getRelativePath(req.file.path);

      res.status(200).json({
        message: "Audio file uploaded successfully",
        filePath: relativePath,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async serveAudio(req: Request, res: Response): Promise<void> {
    try {
      const filePath = req.params[0]; // Get everything after /audio/
      const fullPath = FileUtils.getFullPath(filePath);

      if (!FileUtils.fileExists(fullPath)) {
        res.status(404).json({ error: "Audio file not found" });
        return;
      }

      const ext = FileUtils.getFileExtension(fullPath);
      const mimeTypes: { [key: string]: string } = {
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".m4a": "audio/mp4",
        ".aac": "audio/aac",
        ".ogg": "audio/ogg",
        ".webm": "audio/webm",
      };

      const mimeType = mimeTypes[ext] || "audio/mpeg";

      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", FileUtils.getFileSize(fullPath));
      res.setHeader("Accept-Ranges", "bytes");

      const fs = require("fs");
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);

      fileStream.on("error", (error: any) => {
        console.error("Error streaming file:", error);
        res.status(500).json({ error: "Error streaming audio file" });
      });
    } catch (error) {
      console.error("Error serving audio file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default NoteController;
