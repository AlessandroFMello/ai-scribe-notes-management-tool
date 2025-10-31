import { Router } from "express";
import NoteController from "../controllers/noteController";
import noteValidationMiddleware from "../middlewares/noteMiddleware";
import noteUpdateValidationMiddleware from "../middlewares/noteUpdateMiddleware";
import {
  uploadSingle,
  handleUploadError,
} from "../middlewares/uploadMiddleware";

const router = Router();
const noteController = new NoteController();

router.get("/", noteController.getAll);

router.get("/:id", noteController.getById);

router.post(
  "/",
  uploadSingle,
  handleUploadError,
  noteValidationMiddleware,
  noteController.create
);

// POST /api/notes/upload - Upload audio file only
router.post(
  "/upload",
  uploadSingle,
  handleUploadError,
  noteController.uploadAudio
);

router.put("/:id", noteUpdateValidationMiddleware, noteController.update);

router.delete("/:id", noteController.delete);

// GET /api/notes/audio/:filePath - Serve audio files
router.get("/audio/*", noteController.serveAudio);

// POST /api/notes/:id/process-ai - Process note with AI
router.post("/:id/process-ai", noteController.processWithAI);

export default router;
