import { Request, Response } from "express";

/**
 * Handles the status/health check endpoint.
 */
export const getStatus = (req: Request, res: Response): void => {
  res.status(200).send("LifeMax API is running");
};
