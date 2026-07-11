import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/weekly", asyncHandler(analyticsController.getWeeklyAnalytics));
router.get("/trends", asyncHandler(analyticsController.getTrends));

export default router;
