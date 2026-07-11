import { Router } from "express";
import { dayLogController } from "../controllers/daylog.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/:date", asyncHandler(dayLogController.getDayLog));
router.post("/:date/save", asyncHandler(dayLogController.saveDayLog));
router.delete("/:date", asyncHandler(dayLogController.deleteDayLog));

export default router;
