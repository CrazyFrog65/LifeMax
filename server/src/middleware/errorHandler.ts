import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

/**
 * Global error handler. Catches all errors thrown or forwarded
 * by asyncHandler and returns a structured JSON response.
 */
export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;

  logger.error({ err, statusCode }, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
