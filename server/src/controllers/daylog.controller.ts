import { Request, Response } from "express";
import { dayLogService } from "../services/daylog.service.js";

export const dayLogController = {
  getDayLog: async (req: Request, res: Response) => {
    const { date } = req.params;
    if (!req.user) throw new Error("User not found in request");

    const dayLog = await dayLogService.getDayLogByDate(req.user.id, date as string);
    res.json({ success: true, data: dayLog });
  },

  saveDayLog: async (req: Request, res: Response) => {
    const { date } = req.params;
    const data = req.body; 
    if (!req.user) throw new Error("User not found in request");

    const saved = await dayLogService.saveDayLog(req.user.id, date as string, data);
    res.json({ success: true, data: saved });
  },

  deleteDayLog: async (req: Request, res: Response) => {
    const { date } = req.params;
    if (!req.user) throw new Error("User not found in request");

    await dayLogService.deleteDayLog(req.user.id, date as string);
    res.json({ success: true, message: "Day log deleted successfully" });
  },
};
