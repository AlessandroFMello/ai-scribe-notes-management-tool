import { Request, Response, NextFunction } from "express";
import noteSchema from "../schemas/noteSchema";

const noteValidationMiddleware = (
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

  const result = noteSchema.safeParse({
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

export default noteValidationMiddleware;
