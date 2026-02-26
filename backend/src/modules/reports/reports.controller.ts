import type { Request, Response } from "express";
import { sendData } from "../../shared/utils/http-response.js";
import {
  getDailySummaryContract,
  getDailySummary,
  getDailyPdfBytes,
  getDashboardMetrics,
  getWeeklyCsv,
  getWeeklyPdfBytes,
  getWeeklyReport,
  getWeeklySummaryContract,
} from "./reports.service.js";

export async function getDashboardController(_req: Request, res: Response) {
  const data = await getDashboardMetrics();
  return sendData(res, 200, data);
}

export async function getWeeklyController(req: Request, res: Response) {
  const data = await getWeeklyReport(
    req.query.week_start as string | undefined,
    req.query.branch_id as string | undefined,
  );
  return sendData(res, 200, data);
}

export async function getDailySummaryController(req: Request, res: Response) {
  const date =
    (req.query.date as string | undefined) ??
    new Date().toISOString().slice(0, 10);
  const data = await getDailySummaryContract(
    date,
    req.query.branch_id as string | undefined,
  );
  return sendData(res, 200, data);
}

export async function getWeeklyPdfController(req: Request, res: Response) {
  const payload = await getWeeklyPdfBytes(
    req.query.week_start as string | undefined,
    req.query.branch_id as string | undefined,
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=weekly-report.pdf");
  res.status(200).send(payload);
}

export async function getWeeklyCsvController(req: Request, res: Response) {
  const csv = await getWeeklyCsv(
    req.query.week_start as string | undefined,
    req.query.branch_id as string | undefined,
  );
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=weekly-report.csv",
  );
  res.status(200).send(csv);
}

export async function getDailyPdfController(req: Request, res: Response) {
  const payload = await getDailyPdfBytes(
    req.query.date as string | undefined,
    req.query.branch_id as string | undefined,
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=daily-summary.pdf");
  res.status(200).send(payload);
}

export async function getWeeklySummaryExportController(
  req: Request,
  res: Response,
) {
  const format = (req.query.format as string | undefined) ?? "pdf";
  const weekStart = req.query.week_start as string | undefined;

  if (format === "csv") {
    const csv = await getWeeklyCsv(
      weekStart,
      req.query.branch_id as string | undefined,
    );
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weekly-summary.csv",
    );
    return res.status(200).send(csv);
  }

  const payload = await getWeeklyPdfBytes(
    weekStart,
    req.query.branch_id as string | undefined,
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=weekly-summary.pdf");
  return res.status(200).send(payload);
}

export async function getWeeklySummaryController(req: Request, res: Response) {
  const data = await getWeeklySummaryContract(
    req.query.week_start as string | undefined,
    req.query.branch_id as string | undefined,
  );
  return sendData(res, 200, data);
}
