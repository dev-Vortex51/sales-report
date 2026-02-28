"use client";

// 1. Added useState import
import { useMemo, useState } from "react";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  formatCurrency,
  formatDate,
  formatTime,
  trendDirection,
  trendLabel,
} from "@/lib/formats";
import {
  mockKPIData,
  mockTrendData,
  mockTopItems,
  mockReceipts,
} from "@/lib/mock-data";
import { Eye } from "lucide-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getDashboard } from "@/api/reports.api";

export default function DashboardView() {
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");
  const { data } = useSuspenseQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (!data) return null;

  const { today, yesterday, weekly_trend, top_items, recent_sales } = data;

  const chartData = useMemo(
    () =>
      weekly_trend.map((d) => ({
        day: new Date(d.date).toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        revenue: d.total_revenue,
      })),
    [data],
  );

  const maxRevenue = useMemo(() => {
    if (!top_items || top_items.length === 0) return 0;
    return Math.max(...top_items.map((item) => item.total_revenue));
  }, [top_items]);

  const currentDate = new Date();

  const recentSales =
    recent_sales && recent_sales.length > 0
      ? recent_sales.map((s: any) => ({
          id: s.id,
          receiptNumber: s.receipt_number ?? s.receiptNumber,
          date: s.sale_timestamp ? new Date(s.sale_timestamp) : s.date,
          customerName: s.customer_name ?? s.customerName,
          items: Array.from({ length: s.item_count ?? 0 }),
          total: s.total_amount ?? s.total,
          status: s.status,
        }))
      : mockReceipts.slice(0, 5);

  const handleViewReceipt = (receiptId: string) => {
    const receipt = mockReceipts.find((r) => r.id === receiptId);
    if (receipt) {
      setSelectedReceipt(receipt);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Total Revenue"
            value={formatCurrency(today.total_revenue)}
            trend={{
              direction: trendDirection(
                today.total_revenue,
                yesterday.total_revenue,
              ),
              text: trendLabel(today.total_revenue, yesterday.total_revenue),
            }}
          />
          <KPICard
            label="Transactions"
            value={today.transaction_count}
            trend={{
              direction: trendDirection(
                today.transaction_count,
                yesterday.transaction_count,
              ),
              text: trendLabel(
                today.transaction_count,
                yesterday.transaction_count,
              ),
            }}
          />
          <KPICard
            label="Avg. Basket Value"
            value={formatCurrency(today.average_basket)}
            trend={{
              direction: trendDirection(
                today.average_basket,
                yesterday.average_basket,
              ),
              text: trendLabel(today.average_basket, yesterday.average_basket),
            }}
          />
          <KPICard
            label="Total Tax"
            value={formatCurrency(today.total_tax)}
            trend={{
              direction: trendDirection(today.total_tax, yesterday.total_tax),
              text: trendLabel(today.total_tax, yesterday.total_tax),
            }}
          />
        </div>

        {/* Charts and Top Items */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-1 group relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-border/70 hover:bg-card/80 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Weekly Revenue Trend
            </h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80  p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Top Selling Items
            </h2>
            <div className="mt-6 space-y-4">
              {top_items.map((item) => (
                <div
                  key={item.description}
                  className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.description}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.quantity_sold} sold
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(item.total_revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 shadow-none p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Sales
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("SalesHistory")}
            >
              View All
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-600">Receipt #</TableHead>
                  <TableHead className="text-slate-600">Time</TableHead>
                  <TableHead className="text-slate-600">Customer</TableHead>
                  <TableHead className="text-slate-600">Items</TableHead>
                  <TableHead className="text-right text-slate-600">
                    Total
                  </TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-slate-600">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale: any) => (
                  <TableRow key={sale.id} className="border-slate-100">
                    <TableCell className="font-medium text-slate-900">
                      {sale.receiptNumber}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {formatTime(sale.date)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {sale.customerName}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {sale.items.length} item{sale.items.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {formatCurrency(sale.total)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sale.status} />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewReceipt(sale.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
