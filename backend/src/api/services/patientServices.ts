import prisma from '../models/connection';

class PatientServices {
  private NOT_FOUND: string;

  constructor() {
    this.NOT_FOUND = 'Patient not found.';

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(): Promise<{ code: number; data?: any; message?: string }> {
    try {
      const allPatients = await prisma.patient.findMany({
        include: {
          notes: {
            select: {
              id: true,
              noteType: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!allPatients || allPatients.length === 0) {
        return { code: 404, message: this.NOT_FOUND };
      }

      return { code: 200, data: allPatients };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error retrieving patients' };
    }
  }

  async getById(
    id: string
  ): Promise<{ code: number; data?: any; message?: string }> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          notes: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!patient) {
        return { code: 404, message: this.NOT_FOUND };
      }

      return { code: 200, data: patient };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error retrieving patient' };
    }
  }

  async create(
    name: string,
    dateOfBirth: string,
    patientId: string,
    phone?: string,
    email?: string,
    address?: string
  ): Promise<{ code: number; patient?: any; message?: string }> {
    try {
      const existingPatient = await prisma.patient.findFirst({
        where: { patientId },
      });

      if (existingPatient) {
        return { code: 409, message: 'Patient ID already exists' };
      }

      const newPatient = {
        name,
        dateOfBirth: new Date(dateOfBirth),
        patientId,
        phone,
        email,
        address,
      };

      const patient = await prisma.patient.create({ data: newPatient });

      if (!patient) {
        return { code: 400, message: 'Failed to create patient' };
      }

      return { code: 201, patient };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error creating patient' };
    }
  }

  async update(
    id: string,
    name: string,
    dateOfBirth: string,
    patientId: string,
    phone?: string,
    email?: string,
    address?: string
  ): Promise<{ code: number; patient?: any; message?: string }> {
    try {
      const existingPatient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!existingPatient) {
        return { code: 404, message: this.NOT_FOUND };
      }

      const updatedPatient = {
        name,
        dateOfBirth: new Date(dateOfBirth),
        patientId,
        phone,
        email,
        address,
      };

      const patient = await prisma.patient.update({
        where: { id },
        data: updatedPatient,
      });

      if (!patient) {
        return { code: 400, message: 'Failed to update patient' };
      }

      return { code: 200, patient };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error updating patient' };
    }
  }

  async delete(id: string): Promise<{ code: number; message?: string }> {
    try {
      const existingPatient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!existingPatient) {
        return { code: 404, message: this.NOT_FOUND };
      }

      await prisma.patient.delete({
        where: { id },
      });

      return { code: 200, message: 'Patient deleted successfully' };
    } catch (error) {
      console.error(error);
      return { code: 400, message: 'Error deleting patient' };
    }
  }
}

export default PatientServices;
