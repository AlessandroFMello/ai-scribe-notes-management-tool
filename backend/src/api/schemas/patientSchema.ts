import { z } from "zod";

const patientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .refine((val) => val.trim().length > 0, "Name is required"),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  patientId: z.string().min(1, "Patient ID is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  address: z.string().optional(),
});

export default patientSchema;
