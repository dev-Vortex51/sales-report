import { TrendIcon } from "./trend-icon";

interface KPICardProps {
  isFor?: string;
  label: string;
  value: string | number;
  trend?: {
    direction: "up" | "down" | "flat";
    text: string;
  };
  icon?: React.ReactNode;
}

export function KPICard({ label, value, trend, icon, isFor }: KPICardProps) {
  console.log(trend);
  const isPositive = trend?.direction === "up";
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-border/70 hover:bg-card/80 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <TrendIcon trend={trend?.text} isPositive={isPositive} />
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend?.text}% vs {isFor !== "weekly" ? "yesterday" : "last week"}
        </span>
      </div>
    </div>
  );
}
