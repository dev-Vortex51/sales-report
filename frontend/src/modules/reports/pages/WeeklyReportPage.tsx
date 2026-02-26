import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { downloadWeeklyReportCsv, getWeeklyReport } from "../api/reports.api";
import { WeeklyTrendChart } from "../components/WeeklyTrendChart";
import { TopItemsList } from "../components/TopItemsList";
import { ExportButton } from "../components/ExportButton";
import { KpiCard } from "@core/components/KpiCard";
import { Input } from "@core/components/Input";
import { Button } from "@core/components/Button";

function getMonday(d: Date): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date.toISOString().slice(0, 10);
}

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function WeeklyReportPage() {
  async function openBlobInNewTab(loader: () => Promise<string>) {
    const blobUrl = await loader();
    window.open(blobUrl, "_blank", "noopener,noreferrer");
  }

  const [weekStart, setWeekStart] = useState(getMonday(new Date()));

  const { data, isLoading } = useQuery({
    queryKey: ["weeklyReport", weekStart],
    queryFn: () => getWeeklyReport(weekStart),
  });

  function prevWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().slice(0, 10));
  }

  function nextWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    if (d <= new Date()) setWeekStart(d.toISOString().slice(0, 10));
  }

  const hasData = data && data.totals.transaction_count > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with week selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">Weekly Report</h1>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={prevWeek}>
            ◀
          </Button>
          <Input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
          <Button variant="ghost" onClick={nextWeek}>
            ▶
          </Button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-lg border border-border bg-muted"
              />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-lg border border-border bg-muted" />
          <div className="h-72 animate-pulse rounded-lg border border-border bg-muted" />
          <div className="h-40 animate-pulse rounded-lg border border-border bg-muted" />
        </div>
      ) : (
        <>
          {/* Summary KPI Cards (3 per wireframe) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              label="Weekly Revenue"
              value={`£${data.totals.total_revenue.toFixed(2)}`}
            />
            <KpiCard
              label="Total Sales"
              value={String(data.totals.transaction_count)}
            />
            <KpiCard
              label="Total Tax"
              value={`£${data.totals.total_tax.toFixed(2)}`}
            />
          </div>

          {/* Daily Breakdown Table */}
          {!hasData ? (
            <div className="rounded-lg border border-border bg-card px-6 py-8 text-center text-sm text-muted-foreground">
              No sales data available for the selected week.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted text-left text-xs font-semibold uppercase text-muted-foreground">
                    <th className="px-4 py-3">Day</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                    <th className="px-4 py-3 text-right">Sales</th>
                    <th className="px-4 py-3 text-right">Avg Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {data.daily_breakdown.map((day, idx) => (
                    <tr key={day.date} className="border-b border-border">
                      <td className="px-4 py-3">{DAY_NAMES[idx] ?? ""}</td>
                      <td className="px-4 py-3">
                        {new Date(day.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        £{day.total_revenue.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {day.transaction_count}
                      </td>
                      <td className="px-4 py-3 text-right">
                        £{day.average_basket.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td className="px-4 py-3" colSpan={2}>
                      Total
                    </td>
                    <td className="px-4 py-3 text-right">
                      £{data.totals.total_revenue.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.totals.transaction_count}
                    </td>
                    <td className="px-4 py-3 text-right">
                      £{data.totals.average_basket.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Revenue Trend Chart + Top Items — only when data exists */}
          {hasData && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
              <WeeklyTrendChart data={data.daily_breakdown} />
              <TopItemsList items={data.top_items} />
            </div>
          )}

          {/* Export buttons */}
          <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <Button
              variant="secondary"
              disabled={!hasData}
              onClick={() =>
                openBlobInNewTab(() => downloadWeeklyReportCsv(weekStart))
              }
            >
              Export CSV
            </Button>
            <ExportButton weekStart={weekStart} disabled={!hasData} />
          </div>
        </>
      )}
    </div>
  );
}
