import express from "express";
import cors from "cors";
import pinoHttpModule from "pino-http";
import { logger } from "./config/logger.js";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/auth.js";

const pinoHttp = (pinoHttpModule as any).default || pinoHttpModule;

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Structured logging for HTTP requests
app.use(pinoHttp({ logger }));

// Root route prefix
app.get("/", (req, res) => {
  res.json({ success: true, message: "LifeMax API is active and running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api", requireAuth, routes);

app.use(errorHandler);

export default app;
