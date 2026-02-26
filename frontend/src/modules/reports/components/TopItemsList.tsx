import { useMemo } from "react";
import { Trophy, PackageOpen, Crown } from "lucide-react";
import type { TopItem } from "../types/reports.types";

interface TopItemsListProps {
  items: TopItem[];
}

export function TopItemsList({ items }: TopItemsListProps) {
  // Calculate the highest revenue to serve as the 100% benchmark for our visual bars
  const maxRevenue = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return Math.max(...items.map((item) => item.total_revenue));
  }, [items]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-secondary p-6 shadow-sm">
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-secondary">
          <Trophy className="h-4 w-4 text-tertiary" />
          Top Performers
        </h3>
        <span className="text-xs font-medium text-tertiary">By Revenue</span>
      </div>

      {items.length === 0 ? (
        /* ── Empty State ── */
        <div className="flex flex-1 flex-col items-center justify-center gap-3 min-h-55">
          <PackageOpen
            className="h-8 w-8 text-tertiary opacity-40"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-tertiary">
            No items sold yet.
          </p>
        </div>
      ) : (
        /* ── Ranked List ── */
        <ul className="flex flex-col gap-4">
          {items.map((item, idx) => {
            const isFirst = idx === 0;
            const fillPercentage =
              maxRevenue > 0 ? (item.total_revenue / maxRevenue) * 100 : 0;

            return (
              <li
                key={item.description}
                className="group relative flex items-center gap-4"
              >
                {/* Rank Indicator */}
                <div className="flex w-6 shrink-0 justify-center">
                  {isFirst ? (
                    <Crown className="h-5 w-5 text-amber-500 drop-shadow-sm" />
                  ) : (
                    <span className="text-sm font-bold text-tertiary group-hover:text-secondary transition-colors">
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* Item Details & Visual Bar */}
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                  <div className="flex items-end justify-between gap-4">
                    <span
                      className={`truncate text-sm font-medium ${
                        isFirst
                          ? "text-primary font-semibold"
                          : "text-secondary"
                      }`}
                      title={item.description}
                    >
                      {item.description}
                    </span>

                    {/* Revenue & Quantity (Right Aligned) */}
                    <div className="flex shrink-0 flex-col items-end leading-none">
                      <span className="tabular-nums text-sm font-bold tracking-tight text-primary">
                        £{item.total_revenue.toFixed(2)}
                      </span>
                      <span className="mt-1 tabular-nums text-[11px] font-medium text-tertiary">
                        {item.quantity_sold}{" "}
                        {item.quantity_sold === 1 ? "unit" : "units"}
                      </span>
                    </div>
                  </div>

                  {/* Relative Performance Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-tertiary">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isFirst
                          ? "bg-amber-500"
                          : "bg-primary opacity-60 group-hover:opacity-100"
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
