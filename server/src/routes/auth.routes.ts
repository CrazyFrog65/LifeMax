import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/me", requireAuth, asyncHandler(authController.getMe));

export default router;
