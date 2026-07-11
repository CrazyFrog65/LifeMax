import { Router } from "express";
import { getStatus } from "../controllers/status.controller.js";

import categoryRoutes from "./category.routes.js";
import dayLogRoutes from "./daylog.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = Router();

// Mount status check at the API root
router.get("/", getStatus);

// Mount feature routes
router.use("/categories", categoryRoutes);
router.use("/day-logs", dayLogRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
