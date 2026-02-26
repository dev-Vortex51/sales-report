export function getMonday(d: Date): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date.toISOString().slice(0, 10);
}

export function trendDirection(
  curr: number,
  prev: number,
): "up" | "down" | "flat" {
  if (prev === 0) return curr > 0 ? "up" : "flat";
  const pct = ((curr - prev) / prev) * 100;
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "flat";
}

export function trendLabel(curr: number, prev: number): string {
  if (prev === 0) return curr > 0 ? "+100% vs yesterday" : "—";
  const pct = ((curr - prev) / prev) * 100;
  return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}% vs yesterday`;
}

export const statusVariant = (s: string) =>
  s === "COMPLETED" ? "success" : s === "VOID" ? "error" : "warning";

export const statusLabel = (s: string) =>
  s === "COMPLETED" ? "Completed" : s === "VOID" ? "Void" : "Pending";

export const formatCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return formatted;
};
