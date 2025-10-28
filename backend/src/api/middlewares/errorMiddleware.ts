import { Request, Response, NextFunction } from "express";

export default function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void {
  console.error(error);

  const status = (error as any).statusCode || 500;
  const message = error.message || "Internal server error";

  response.status(status).json({ message });
}
