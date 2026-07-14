import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ success: false, message: "Name, email, and password are required" });
      return;
    }

    try {
      const { user, token } = await authService.register({
        email,
        passwordHash: password, // authService will hash it
        name,
      });

      const { passwordHash, ...userWithoutPassword } = user;
      res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    try {
      const { user, token } = await authService.login(email, password);

      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getMe: async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const { passwordHash, ...userWithoutPassword } = req.user as any;
    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  },
};
