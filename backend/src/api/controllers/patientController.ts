import { Request, Response } from 'express';
import PatientServices from '../services/patientServices';
import Controller from './controller';

class PatientController extends Controller {
  private patientService: PatientServices;

  constructor() {
    super(new PatientServices());
    this.patientService = new PatientServices();

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, dateOfBirth, patientId, phone, email, address } = req.body;

      const { code, patient, message } = await this.patientService.create(
        name,
        dateOfBirth,
        patientId,
        phone,
        email,
        address
      );

      if (!patient) {
        res.status(code).json({ message });
        return;
      }

      res.status(code).json(patient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, dateOfBirth, patientId, phone, email, address } = req.body;

      const { code, patient, message } = await this.patientService.update(
        id,
        name,
        dateOfBirth,
        patientId,
        phone,
        email,
        address
      );

      if (!patient) {
        res.status(code).json({ message });
        return;
      }

      res.status(code).json(patient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
}

export default PatientController;
