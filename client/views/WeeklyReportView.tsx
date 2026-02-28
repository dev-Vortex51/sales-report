"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KPICard } from "@/components/shared/kpi-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  formatCurrency,
  formatDate,
  getMonday,
  trendDirection,
  trendLabel,
} from "@/lib/formats";
import { mockDailySales, mockTrendData, mockTopItems } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import BranchSelector from "@/components/data-selector";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getWeeklyReport } from "@/api/reports.api";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyReportView() {
  const [branch, setBranch] = useState("all");
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));

  const prevWeekStart = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  }, [weekStart]);

  // Current Week
  const { data: currentData } = useSuspenseQuery({
    queryKey: ["weeklyReport", weekStart],
    queryFn: () => getWeeklyReport(weekStart),
  });

  // Previous Week
  const { data: previousData } = useSuspenseQuery({
    queryKey: ["weeklyReport", prevWeekStart],
    queryFn: () => getWeeklyReport(prevWeekStart),
  });

  const { daily_breakdown, top_items, totals: currentTotals } = currentData;
  const { totals: lastWeekTotals } = previousData;

  const chartData = useMemo(
    () =>
      daily_breakdown.map((d) => ({
        day: new Date(d.date).toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        revenue: d.total_revenue,
      })),
    [daily_breakdown],
  );

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

  return (
    <div className="">
      <div className=" space-y-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="md:flex-1">
            <label className="block text-sm font-medium text-slate-700">
              Week Starting
            </label>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={prevWeek}>
                <ChevronLeft size={32} />
              </Button>
              <Input
                type="date"
                className="mt-1"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
              />
              <Button variant="ghost" onClick={nextWeek}>
                <ChevronRight size={24} />
              </Button>
            </div>
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-slate-700">
              Branch
            </label>
            <BranchSelector />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <KPICard
            label="Weekly Revenue"
            value={formatCurrency(currentTotals.total_revenue)}
            trend={{
              direction: trendDirection(
                currentTotals.total_revenue,
                lastWeekTotals.total_revenue,
              ),
              text: trendLabel(
                currentTotals.total_revenue,
                lastWeekTotals.total_revenue,
              ),
            }}
            isFor="weekly"
          />
          <KPICard
            label="Total Sales"
            value={currentTotals.transaction_count}
            trend={{
              direction: trendDirection(
                currentTotals.transaction_count,
                lastWeekTotals.transaction_count,
              ),
              text: trendLabel(
                currentTotals.transaction_count,
                lastWeekTotals.transaction_count,
              ),
            }}
            isFor="weekly"
          />
          <KPICard
            label="Total Tax"
            value={formatCurrency(currentTotals.total_tax)}
            trend={{
              direction: trendDirection(
                currentTotals.total_tax,
                lastWeekTotals.total_tax,
              ),
              text: trendLabel(
                currentTotals.total_tax,
                lastWeekTotals.total_tax,
              ),
            }}
            isFor="weekly"
          />
        </div>

        {/* Daily Breakdown Table */}
        <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6 ">
          <h2 className="text-lg font-semibold text-slate-900">
            Daily Breakdown
          </h2>
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-600">Day</TableHead>
                  <TableHead className="text-right text-slate-600">
                    Revenue
                  </TableHead>
                  <TableHead className="text-right text-slate-600">
                    Sales
                  </TableHead>
                  <TableHead className="text-right text-slate-600">
                    Avg Sale
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daily_breakdown.map((day, idx) => (
                  <TableRow key={day.date} className="border-slate-100">
                    <TableCell className="font-medium text-slate-900">
                      {DAY_NAMES[idx] ?? ""}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {formatCurrency(day.total_revenue)}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {day.transaction_count}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {formatCurrency(day.average_basket)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Trend */}
          <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Revenue Trend
            </h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Items */}
          <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Top Selling Items
            </h2>
            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-600">Item</TableHead>
                    <TableHead className="text-right text-slate-600">
                      Qty
                    </TableHead>
                    <TableHead className="text-right text-slate-600">
                      Revenue
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top_items.map((item) => (
                    <TableRow
                      key={item.description}
                      className="border-slate-100"
                    >
                      <TableCell className="text-sm font-medium text-slate-900">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-600">
                        {item.quantity_sold}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-slate-900">
                        {formatCurrency(item.total_revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
