import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const noteUpdateSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required").optional(),
  rawText: z.string().optional(),
  transcribedText: z.string().optional(),
  aiSummary: z.string().optional(),
  noteType: z.enum(["TEXT", "AUDIO", "MIXED"]).optional(),
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

const noteUpdateValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    patientId,
    rawText,
    transcribedText,
    aiSummary,
    noteType,
    audioFilePath,
    soapFormat,
  } = req.body;

  const result = noteUpdateSchema.safeParse({
    patientId,
    rawText,
    transcribedText,
    aiSummary,
    noteType,
    audioFilePath,
    soapFormat,
  });

  if (!result.success) {
    const error = result.error.errors[0];
    const errorMessage = error.message;

    // Determine status code based on error type
    let statusCode = 400;
    if (errorMessage.includes("required")) {
      statusCode = 422;
    }

    return res.status(statusCode).json({ error: errorMessage });
  }

  return next();
};

export default noteUpdateValidationMiddleware;
