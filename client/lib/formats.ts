export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(date: Date, includeTime = false): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateTax(amount: number, taxRate: number): number {
  return parseFloat(((amount * taxRate) / 100).toFixed(2));
}

export function calculateTotal(subtotal: number, tax: number): number {
  return parseFloat((subtotal + tax).toFixed(2));
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
  if (prev === 0) return curr > 0 ? "+100.0" : "—0.0";
  const pct = ((curr - prev) / prev) * 100;
  return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}`;
}

export function getMonday(d: Date): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date.toISOString().slice(0, 10);
}
