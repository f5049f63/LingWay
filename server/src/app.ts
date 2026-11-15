import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { healthRouter } from "./routes/health";
import { situationsRouter } from "./routes/situations";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/situations", situationsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
