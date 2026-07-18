import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${req.method} ${req.originalUrl} -`, message);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFound = (req: Request, res: Response) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
};
