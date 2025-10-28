import { Router } from "express";
import PatientController from "../controllers/patientController";
import patientValidationMiddleware from "../middlewares/patientMiddleware";

const router = Router();
const patientController = new PatientController();

router.get("/", patientController.getAll);

router.get("/:id", patientController.getById);

router.post("/", patientValidationMiddleware, patientController.create);

router.put("/:id", patientValidationMiddleware, patientController.update);

router.delete("/:id", patientController.delete);

export default router;
