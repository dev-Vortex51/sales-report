import { apiClient } from "@/lib/api-client";
import type {
  DashboardMetrics,
  WeeklyReport,
} from "../../frontend/src/modules/reports/types/reports.types";

interface ApiEnvelope<T> {
  data: T;
}

export async function getDashboard(): Promise<DashboardMetrics> {
  const res =
    await apiClient.get<ApiEnvelope<DashboardMetrics>>("/reports/dashboard");
  return res.data.data;
}

export async function getWeeklyReport(
  weekStart?: string,
): Promise<WeeklyReport> {
  const params = weekStart ? { week_start: weekStart } : {};
  const res = await apiClient.get<ApiEnvelope<WeeklyReport>>(
    "/reports/weekly",
    {
      params,
    },
  );
  return res.data.data;
}

export async function downloadWeeklyReportPdf(
  weekStart: string,
): Promise<string> {
  const res = await apiClient.get<Blob>("/reports/weekly/pdf", {
    params: { week_start: weekStart },
    responseType: "blob",
  });
  return URL.createObjectURL(res.data);
}

export async function downloadWeeklyReportCsv(
  weekStart: string,
): Promise<string> {
  const res = await apiClient.get<Blob>("/reports/weekly/csv", {
    params: { week_start: weekStart },
    responseType: "blob",
  });
  return URL.createObjectURL(res.data);
}

export async function downloadDailySummaryPdf(date: string): Promise<string> {
  const res = await apiClient.get<Blob>("/reports/daily/pdf", {
    params: { date },
    responseType: "blob",
  });
  return URL.createObjectURL(res.data);
}
