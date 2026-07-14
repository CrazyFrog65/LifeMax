import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_lifemax";

/**
 * JWT Authentication middleware.
 * Extracts JWT token from the Authorization header and verifies it.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
      return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({ success: false, message: "Unauthorized - Token format should be Bearer <token>" });
      return;
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized - User not found" });
        return;
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
      return;
    }
  } catch (error) {
    next(error);
  }
};
