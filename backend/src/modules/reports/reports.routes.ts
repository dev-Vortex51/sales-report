import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import {
  getDailySummaryController,
  getDailyPdfController,
  getDashboardController,
  getWeeklySummaryController,
  getWeeklyController,
  getWeeklyCsvController,
  getWeeklyPdfController,
  getWeeklySummaryExportController,
} from "./reports.controller.js";
import { dailyPdfQuerySchema, weeklyQuerySchema } from "./reports.schemas.js";

export const reportsRouter = Router();

reportsRouter.use(authMiddleware);

reportsRouter.get("/dashboard", asyncHandler(getDashboardController));
reportsRouter.get(
  "/daily-summary",
  validate(dailyPdfQuerySchema),
  asyncHandler(getDailySummaryController),
);
reportsRouter.get(
  "/weekly",
  validate(weeklyQuerySchema),
  asyncHandler(getWeeklyController),
);
reportsRouter.get(
  "/weekly-summary",
  validate(weeklyQuerySchema),
  asyncHandler(getWeeklySummaryController),
);
reportsRouter.get(
  "/weekly-summary/export",
  validate(weeklyQuerySchema),
  asyncHandler(getWeeklySummaryExportController),
);
reportsRouter.get(
  "/weekly/pdf",
  validate(weeklyQuerySchema),
  asyncHandler(getWeeklyPdfController),
);
reportsRouter.get(
  "/weekly/csv",
  validate(weeklyQuerySchema),
  asyncHandler(getWeeklyCsvController),
);
reportsRouter.get(
  "/daily/pdf",
  validate(dailyPdfQuerySchema),
  asyncHandler(getDailyPdfController),
);
