import { z } from "zod";

const noteSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  rawText: z.string().optional(),
  transcribedText: z.string().optional(),
  aiSummary: z.string().optional(),
  noteType: z.enum(["TEXT", "AUDIO", "MIXED"]).default("TEXT"),
  audioFilePath: z.string().optional(),
  soapFormat: z
    .object({
      subjective: z.string().optional(),
      objective: z.string().optional(),
      assessment: z.string().optional(),
      plan: z.string().optional(),
    })
    .optional(),
});

export default noteSchema;
