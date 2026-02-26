import {
  renderDailySummaryPdf,
  renderWeeklyReportPdf,
} from "../../shared/services/pdf.service.js";
import { addMoney, toMoneyNumber } from "../../shared/utils/money.js";
import {
  findBranchById,
  findCompletedSalesInRange,
  findFirstActiveBranch,
  findFirstSettingByCreateAsc,
  findRecentCompletedSales,
  groupTopItemsByRevenue,
} from "./reports.repository.js";

function isoDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseTimezoneOffsetMinutes(timezone: string): number {
  const raw = timezone.trim();
  if (/^[+-]\d{2}:\d{2}$/.test(raw)) {
    const sign = raw.startsWith("-") ? -1 : 1;
    const [hh, mm] = raw.slice(1).split(":");
    return sign * (Number(hh) * 60 + Number(mm));
  }

  if (/^UTC[+-]\d{1,2}$/.test(raw)) {
    const value = Number(raw.replace("UTC", ""));
    return value * 60;
  }

  return 0;
}

function utcRangeForBranchDate(date: Date, timezone: string) {
  const offsetMinutes = parseTimezoneOffsetMinutes(timezone);
  const dayStartUtc = new Date(date);
  dayStartUtc.setUTCHours(0, 0, 0, 0);

  const start = new Date(dayStartUtc.getTime() - offsetMinutes * 60_000);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

async function resolveBranchContext(branchId?: string) {
  if (branchId) {
    const branch = await findBranchById(branchId);
    return {
      branchId,
      timezone: branch?.timezone ?? "UTC",
    };
  }

  const branch = await findFirstActiveBranch();
  return {
    branchId: branch?.id,
    timezone: branch?.timezone ?? "UTC",
  };
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function startOfWeek(date: Date) {
  const d = startOfDay(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

function toNumber(value: { toString(): string } | number) {
  return Number(value);
}

export async function getDailySummary(dateInput: string, branchId?: string) {
  const date = startOfDay(new Date(dateInput));
  const branchCtx = await resolveBranchContext(branchId);
  const { start, end } = utcRangeForBranchDate(date, branchCtx.timezone);

  const sales = await findCompletedSalesInRange({
    start,
    end,
    branchId: branchCtx.branchId,
  });

  const transactionCount = sales.length;
  const totalRevenue = addMoney(...sales.map((s) => toNumber(s.totalAmount)));
  const totalTax = addMoney(...sales.map((s) => toNumber(s.taxAmount)));

  return {
    date: isoDateOnly(date),
    branch_id: branchCtx.branchId ?? "",
    transaction_count: transactionCount,
    total_revenue: toMoneyNumber(totalRevenue),
    total_tax: toMoneyNumber(totalTax),
    average_basket:
      transactionCount > 0
        ? toMoneyNumber(totalRevenue.div(transactionCount))
        : 0,
  };
}

async function getTopItems(
  rangeStart: Date,
  rangeEnd: Date,
  branchId?: string,
) {
  const rows = await groupTopItemsByRevenue({ rangeStart, rangeEnd, branchId });

  return rows.map((row) => ({
    description: row.description,
    quantity_sold: row._sum.quantity ?? 0,
    total_revenue: Number(toNumber(row._sum.lineTotal ?? 0).toFixed(2)),
  }));
}

export async function getDashboardMetrics() {
  const todayDate = startOfDay(new Date());
  const yesterdayDate = addDays(todayDate, -1);
  const weekStart = addDays(todayDate, -6);
  const weekEndExclusive = addDays(todayDate, 1);
  const branchCtx = await resolveBranchContext(undefined);

  const [today, yesterday, weeklyTrend, topItems, recentSales] =
    await Promise.all([
      getDailySummary(isoDateOnly(todayDate), branchCtx.branchId),
      getDailySummary(isoDateOnly(yesterdayDate), branchCtx.branchId),
      Promise.all(
        Array.from({ length: 7 }).map((_, index) =>
          getDailySummary(
            isoDateOnly(addDays(weekStart, index)),
            branchCtx.branchId,
          ),
        ),
      ),
      getTopItems(weekStart, weekEndExclusive, branchCtx.branchId),
      findRecentCompletedSales(branchCtx.branchId),
    ]);

  return {
    today,
    yesterday,
    weekly_trend: weeklyTrend,
    top_items: topItems,
    recent_sales: recentSales.map((sale) => ({
      id: sale.id,
      receipt_number: sale.receiptNumber,
      sale_timestamp: sale.saleTimestamp.toISOString(),
      customer_name: sale.customerName,
      item_count: sale.items.reduce((sum, i) => sum + i.quantity, 0),
      total_amount: toNumber(sale.totalAmount),
      status: sale.status,
    })),
  };
}

export async function getWeeklyReport(
  weekStartInput?: string,
  branchId?: string,
) {
  const weekStart = weekStartInput
    ? startOfDay(new Date(weekStartInput))
    : startOfWeek(new Date());
  const branchCtx = await resolveBranchContext(branchId);
  const { start: weekStartUtc } = utcRangeForBranchDate(
    weekStart,
    branchCtx.timezone,
  );
  const weekEndUtc = addDays(weekStartUtc, 7);

  const [dailyBreakdown, topItems, totalsRaw] = await Promise.all([
    Promise.all(
      Array.from({ length: 7 }).map((_, index) =>
        getDailySummary(
          isoDateOnly(addDays(weekStart, index)),
          branchCtx.branchId,
        ),
      ),
    ),
    getTopItems(weekStartUtc, weekEndUtc, branchCtx.branchId),
    findCompletedSalesInRange({
      start: weekStartUtc,
      end: weekEndUtc,
      branchId: branchCtx.branchId,
    }),
  ]);

  const transactionCount = totalsRaw.length;
  const totalRevenue = addMoney(
    ...totalsRaw.map((sale) => toNumber(sale.totalAmount)),
  );
  const totalTax = addMoney(
    ...totalsRaw.map((sale) => toNumber(sale.taxAmount)),
  );

  return {
    week_start: isoDateOnly(weekStart),
    week_end: isoDateOnly(addDays(weekStart, 6)),
    branch_id: branchCtx.branchId ?? "",
    daily_breakdown: dailyBreakdown,
    top_items: topItems,
    totals: {
      transaction_count: transactionCount,
      total_revenue: toMoneyNumber(totalRevenue),
      total_tax: toMoneyNumber(totalTax),
      average_basket:
        transactionCount > 0
          ? toMoneyNumber(totalRevenue.div(transactionCount))
          : 0,
    },
  };
}

export async function getWeeklyCsv(weekStartInput?: string, branchId?: string) {
  const report = await getWeeklyReport(weekStartInput, branchId);

  const rows = [
    "date,transaction_count,total_revenue,total_tax,average_basket",
    ...report.daily_breakdown.map(
      (day) =>
        `${day.date},${day.transaction_count},${day.total_revenue},${day.total_tax},${day.average_basket}`,
    ),
    "",
    "top_item,quantity_sold,total_revenue",
    ...report.top_items.map(
      (item) =>
        `\"${item.description.replace(/\"/g, '\"\"')}\",${item.quantity_sold},${item.total_revenue}`,
    ),
  ];

  return rows.join("\n");
}

export async function getWeeklyPdfBytes(
  weekStartInput?: string,
  branchId?: string,
) {
  const report = await getWeeklyReport(weekStartInput, branchId);
  const settings = await findFirstSettingByCreateAsc();
  const currency = settings?.currency ?? "USD";
  return renderWeeklyReportPdf(report, currency);
}

export async function getDailyPdfBytes(dateInput?: string, branchId?: string) {
  const date = dateInput ?? isoDateOnly(new Date());
  const summary = await getDailySummary(date, branchId);
  const settings = await findFirstSettingByCreateAsc();
  const currency = settings?.currency ?? "USD";
  return renderDailySummaryPdf(summary, currency);
}

export async function getDailySummaryContract(
  dateInput: string,
  branchId?: string,
) {
  const summary = await getDailySummary(dateInput, branchId);
  return {
    date: summary.date,
    branch_id: summary.branch_id,
    total_revenue: summary.total_revenue,
    total_tax: summary.total_tax,
    number_of_sales: summary.transaction_count,
    average_sale_value: summary.average_basket,
  };
}

export async function getWeeklySummaryContract(
  weekStartInput?: string,
  branchId?: string,
) {
  const report = await getWeeklyReport(weekStartInput, branchId);
  return {
    week_start: report.week_start,
    week_end: report.week_end,
    branch_id: report.branch_id,
    total_revenue: report.totals.total_revenue,
    total_tax: report.totals.total_tax,
    number_of_sales: report.totals.transaction_count,
    daily_breakdown: report.daily_breakdown.map((d) => ({
      date: d.date,
      total_revenue: d.total_revenue,
      number_of_sales: d.transaction_count,
    })),
    top_items: report.top_items.map((item) => ({
      item_description: item.description,
      quantity_sold: item.quantity_sold,
      revenue: item.total_revenue,
    })),
  };
}
