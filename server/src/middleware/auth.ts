import { Request, Response, NextFunction } from "express";
import prisma from "../config/database.js";

let cachedUser: any = null;

/**
 * Temporary authentication middleware.
 * Looks up the seeded super user and caches it to prevent
 * remote DB queries on every single API request.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!cachedUser) {
      cachedUser = await prisma.user.findFirst({
        where: { email: "alex@lifemax.app" },
      });
    }

    if (!cachedUser) {
      res.status(401).json({ success: false, message: "Unauthorized - Super user not found" });
      return;
    }

    req.user = cachedUser;
    next();
  } catch (error) {
    next(error);
  }
};
