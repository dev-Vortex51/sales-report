import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendPillProps {
  trend: string;
  isPositive: boolean;
}

export function TrendPill({ trend, isPositive }: TrendPillProps) {
  const bgColor = isPositive
    ? "bg-emerald-500/10"
    : "bg-red-500/10"; /* TODO: No token match for status colors */
  const textColor = isPositive
    ? "text-emerald-400"
    : "text-red-400"; /* TODO: No token match for status colors */
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={`${bgColor} inline-flex items-center gap-1 rounded-full px-3 py-1 w-fit`}
    >
      <Icon className={`h-3 w-3 ${textColor}`} />
      <span className={`text-xs font-semibold ${textColor}`}>{trend}</span>
    </div>
  );
}
