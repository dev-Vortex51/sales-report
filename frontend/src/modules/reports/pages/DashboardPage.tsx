import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  FileDown,
  FileText,
  ShoppingCart,
  Sheet,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  downloadDailySummaryPdf,
  downloadWeeklyReportCsv,
  downloadWeeklyReportPdf,
  getDashboard,
} from "../api/reports.api";
import { WeeklyTrendChart } from "../components/WeeklyTrendChart";
import { TopItemsList } from "../components/TopItemsList";
import { KpiCard } from "@core/components/KpiCard";
import { Badge } from "@core/components/Badge";
import { Button } from "@core/components/Button";
import {
  getMonday,
  trendDirection,
  trendLabel,
  statusVariant,
  statusLabel,
  formatCurrency,
} from "../../../core/utils";
import DashboardSkeleton from "../components/DashboardSkeleton";

export function DashboardPage() {
  const navigate = useNavigate();
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchInterval: 60_000,
  });

  /* Close export dropdown when clicking outside */
  useEffect(() => {
    if (!exportOpen) return;
    function handler(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  const todayStr = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function openBlobInNewTab(loader: () => Promise<string>) {
    try {
      const blobUrl = await loader();
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to export document", error);
      // In a real app, trigger a toast notification here
    }
  }

  const exportItems = useMemo(
    () => [
      {
        label: "Daily Summary",
        sublabel: "PDF",
        icon: <FileText className="h-4 w-4 shrink-0" />,
        action: () => openBlobInNewTab(() => downloadDailySummaryPdf(todayIso)),
      },
      {
        label: "Weekly Report",
        sublabel: "PDF",
        icon: <FileDown className="h-4 w-4 shrink-0" />,
        action: () =>
          openBlobInNewTab(() =>
            downloadWeeklyReportPdf(getMonday(new Date())),
          ),
      },
      {
        label: "Weekly Report",
        sublabel: "CSV",
        icon: <Sheet className="h-4 w-4 shrink-0" />,
        action: () =>
          openBlobInNewTab(() =>
            downloadWeeklyReportCsv(getMonday(new Date())),
          ),
      },
    ],
    [todayIso],
  );

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const { today, yesterday, weekly_trend, top_items, recent_sales } = data;
  const isEmpty = today.transaction_count === 0;

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.3s_ease-out]">
      {/* ── Page Header ── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-tertiary">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-bold text-primary">{todayStr}</h1>
        </div>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition-all hover:bg-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() => setExportOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={exportOpen}
          >
            <Download className="h-4 w-4 text-secondary" />
            Export Data
            <ChevronDown
              className={`h-4 w-4 text-tertiary transition-transform duration-200 ${exportOpen ? "rotate-180" : ""}`}
            />
          </button>

          {exportOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 origin-top-right animate-[slideDownAndFade_0.2s_ease-out] rounded-xl border border-border bg-secondary p-1.5 shadow-lg ring-1 ring-black/5"
            >
              {exportItems.map((item) => (
                <button
                  key={`${item.label}-${item.sublabel}`}
                  type="button"
                  role="menuitem"
                  className="group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-tertiary focus:bg-tertiary focus:outline-none"
                  onClick={async () => {
                    setExportOpen(false);
                    await item.action();
                  }}
                >
                  <span className="text-tertiary group-hover:text-primary transition-colors">
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm font-medium text-primary">
                    {item.label}
                  </span>
                  <span className="rounded bg-tertiary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary group-hover:bg-secondary transition-colors">
                    {item.sublabel}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── KPI Cards ── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={formatCurrency(today.total_revenue)}
          icon={Wallet}
          trend={{
            direction: trendDirection(
              today.total_revenue,
              yesterday.total_revenue,
            ),
            text: trendLabel(today.total_revenue, yesterday.total_revenue),
          }}
        />
        <KpiCard
          label="Transactions"
          value={String(today.transaction_count)}
          icon={ShoppingCart}
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
        <KpiCard
          label="Avg. Basket Value"
          value={formatCurrency(today.average_basket)}
          icon={TrendingUp}
          trend={{
            direction: trendDirection(
              today.average_basket,
              yesterday.average_basket,
            ),
            text: trendLabel(today.average_basket, yesterday.average_basket),
          }}
        />
        <KpiCard
          label="Tax Collected"
          value={formatCurrency(today.total_tax)}
          icon={Receipt}
        />
      </section>

      {/* ── Charts & Top Items ── */}
      {!isEmpty && (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklyTrendChart data={weekly_trend} />
          </div>
          <div className="lg:col-span-1">
            <TopItemsList items={top_items} />
          </div>
        </section>
      )}

      {/* ── Recent Sales ── */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-secondary" />
            <h2 className="text-base font-semibold text-primary">
              Recent Sales
            </h2>
            {!isEmpty && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-[10px] font-bold text-secondary">
                {recent_sales.length}
              </span>
            )}
          </div>
          <Link
            to="/sales/history"
            className="group flex items-center gap-1 text-sm font-medium text-primary hover:underline hover:underline-offset-4"
          >
            View all history
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary">
              <ShoppingCart
                className="h-8 w-8 text-secondary"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-lg font-semibold text-primary">
              No sales yet today
            </h3>
            <p className="mt-2 mb-6 max-w-sm text-sm text-secondary">
              Your dashboard is looking a little empty. Record your first
              transaction to start generating insights.
            </p>
            <Button variant="primary" onClick={() => navigate("/sales/new")}>
              Record First Sale
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-tertiary text-xs font-semibold uppercase tracking-wider text-secondary">
                  <th className="px-5 py-3.5">Receipt</th>
                  <th className="px-5 py-3.5">Time</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5 text-right">Items</th>
                  <th className="px-5 py-3.5 text-right">Total</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent_sales.map((sale) => {
                  const isVoid = sale.status === "VOID";
                  return (
                    <tr
                      key={sale.id}
                      className={`group cursor-pointer transition-colors hover:bg-tertiary ${isVoid ? "bg-tertiary/50 opacity-60" : ""}`}
                      onClick={() => navigate(`/sales/history?view=${sale.id}`)}
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-medium text-secondary group-hover:text-primary transition-colors">
                          {sale.receipt_number}
                        </span>
                      </td>
                      <td className="px-5 py-4 tabular-nums text-secondary">
                        {new Date(sale.sale_timestamp).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {sale.customer_name ? (
                          <span className="font-medium text-primary">
                            {sale.customer_name}
                          </span>
                        ) : (
                          <span className="text-tertiary italic">Walk-in</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-secondary">
                        {sale.item_count}
                      </td>
                      <td className="px-5 py-4 text-right font-medium tabular-nums text-primary">
                        {formatCurrency(sale.total_amount)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={statusVariant(sale.status)}>
                          {statusLabel(sale.status)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
