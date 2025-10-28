import { Router } from 'express';
import NoteController from '../controllers/noteController';
import noteValidationMiddleware from '../middlewares/noteMiddleware';
import noteUpdateValidationMiddleware from '../middlewares/noteUpdateMiddleware';

const router = Router();
const noteController = new NoteController();

router.get('/', noteController.getAll);

router.get('/:id', noteController.getById);

router.post('/', noteValidationMiddleware, noteController.create);

router.put('/:id', noteUpdateValidationMiddleware, noteController.update);

router.delete('/:id', noteController.delete);

export default router;
