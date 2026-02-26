import cors from "cors";
import { randomUUID } from "crypto";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { router } from "./routes.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

export const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  const headerId = req.headers["x-request-id"];
  const requestId =
    typeof headerId === "string" && headerId.trim().length > 0
      ? headerId
      : randomUUID();

  const requestLog = logger.child({ requestId });
  (req as Request & { log?: typeof logger }).log = requestLog;

  res.setHeader("x-request-id", requestId);
  requestLog.info(
    { method: req.method, path: req.originalUrl },
    "request start",
  );

  res.on("finish", () => {
    requestLog.info({ statusCode: res.statusCode }, "request end");
  });

  next();
});
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: false,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use(
  `${env.API_PREFIX}/auth/login`,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({ data: { status: "ok" } });
});

app.use(env.API_PREFIX, router);
app.use(errorMiddleware);
