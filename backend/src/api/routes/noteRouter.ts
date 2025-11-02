import { Router } from 'express';
import NoteController from '../controllers/noteController';
import noteValidationMiddleware from '../middlewares/noteMiddleware';
import noteUpdateValidationMiddleware from '../middlewares/noteUpdateMiddleware';
import {
  uploadSingle,
  handleUploadError,
} from '../middlewares/uploadMiddleware';

const router = Router();
const noteController = new NoteController();

router.get('/', noteController.getAll);

router.get('/:id', noteController.getById);

router.post(
  '/',
  uploadSingle,
  handleUploadError,
  noteValidationMiddleware,
  noteController.create
);

router.post(
  '/upload',
  uploadSingle,
  handleUploadError,
  noteController.uploadAudio
);

router.put('/:id', noteUpdateValidationMiddleware, noteController.update);

router.delete('/:id', noteController.delete);

router.get('/audio/*', noteController.serveAudio);

router.post('/:id/process-ai', noteController.processWithAI);

export default router;
