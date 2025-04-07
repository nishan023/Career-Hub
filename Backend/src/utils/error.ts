import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import HttpStatus from "http-status-codes";

// Custom error class that extends the default Error class
export class AppError extends Error {
  public statusCode: number; // Status code like 404, 500, etc.

  constructor(message: string, statusCode: number = 500) {
    super(message); // Call the parent class constructor
    this.name = "AppError"; // Set a custom name for the error
    this.statusCode = statusCode; // Set the status code

    // Optional: Capture the stack trace (line where error happened)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Build standardized error response
const buildError = (err: any) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));

    return {
      code: HttpStatus.BAD_REQUEST,
      message: "Validation error",
      details: formattedErrors,
    };
  }

  // Handle Boom errors (from the authenticate middleware)
  if (err.isBoom) {
    return {
      code: err.output.statusCode,
      message: err.output.payload.message,
    };
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return {
      code: err.statusCode,
      message: err.message,
    };
  }

  // Default error handling
  console.error("Unhandled error:", err);
  return {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  };
};

// Error handling middleware function
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = buildError(err);
  res.status(error.code).json({ error });
};

export default buildError;
