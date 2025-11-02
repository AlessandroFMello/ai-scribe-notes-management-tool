import { Request, Response, NextFunction } from "express";
import patientSchema from "../schemas/patientSchema";

const patientValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, dateOfBirth, patientId, phone, email, address } = req.body;

  const result = patientSchema.safeParse({
    name,
    dateOfBirth,
    patientId,
    phone,
    email,
    address,
  });

  if (!result.success) {
    const error = result.error.errors[0];
    const errorMessage = error.message;

    let statusCode = 400;
    if (errorMessage.includes("at least")) {
      statusCode = 422;
    }

    return res.status(statusCode).json({ error: errorMessage });
  }

  return next();
};

export default patientValidationMiddleware;
