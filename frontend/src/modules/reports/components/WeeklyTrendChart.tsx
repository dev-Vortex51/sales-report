import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
import { Sparkles } from "lucide-react";
import type { DailySummary } from "../types/reports.types";
import { formatCurrency } from "@/core/utils";

interface WeeklyTrendChartProps {
  data: DailySummary[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/95 p-3 backdrop-blur-md">
        <p className="text-xs text-muted-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}:
            {entry.name === "transactions"
              ? entry.value
              : `${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        revenue: d.total_revenue,
        transactions: d.transaction_count,
      })),
    [data],
  );

  const hasRevenue = chartData.some((d) => d.revenue > 0);

  // Calculate total for the header insight
  const totalWeeklyRevenue = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.revenue, 0),
    [chartData],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border/70 hover:bg-card/80">
      {/* ── Contextual Header ── */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          7-Day Revenue Trend
        </p>
        <p
          className="font-black tracking-tighter text-foreground"
          style={{ fontSize: "2rem" }}
        >
          {formatCurrency(totalWeeklyRevenue)}
        </p>
      </div>

      {!hasRevenue ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-55">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-border bg-tertiary/50">
            <Sparkles className="h-6 w-6 text-tertiary opacity-50" />
          </div>
          <p className="text-sm font-medium text-secondary">
            Waiting for your first big sale...
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f1f1f"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#666"
              style={{ fontSize: "12px" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#666"
              style={{ fontSize: "12px" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Background bars for transactions */}
            <Bar
              dataKey="transactions"
              fill="#262626"
              opacity={0.3}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />

            {/* Revenue Area */}
            <Area
              type="monotone"
              dataKey="revenue"
              fill="url(#revenueGradient)"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            {/* Revenue Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
