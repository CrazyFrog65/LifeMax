import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async route handler so that rejected promises
 * are automatically forwarded to Express error middleware.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
