import { Request, Response } from "express";
import { analyticsService } from "../services/analytics.service.js";

export const analyticsController = {
  getWeeklyAnalytics: async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not found in request");

    const data = await analyticsService.getWeeklyAnalytics(req.user.id);
    res.json({ success: true, data });
  },

  getTrends: async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not found in request");

    const data = await analyticsService.getTrendsAnalytics(req.user.id);
    res.json({ success: true, data });
  },
};
