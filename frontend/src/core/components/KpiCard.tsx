import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TrendPill } from "./TrendPill";

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: {
    direction: "up" | "down" | "flat";
    text: string;
  };
}

export function KpiCard({ label, value, icon: Icon, trend }: KpiCardProps) {
  const isPositive = trend?.direction === "up";

  return (
    <div
      key={label}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-border/70 hover:bg-card/80 hover:-translate-y-0.5"
    >
      {/* Decorative icon */}
      <div className="absolute right-4 top-4 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
        <Icon className="h-16 w-16 text-accent" />
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>

        <div className="flex items-end justify-between">
          <p
            className="font-black tracking-tighter text-foreground"
            style={{ fontSize: "2.25rem" }}
          >
            {value}
          </p>
        </div>

        <TrendPill trend={trend?.text} isPositive={isPositive} />
      </div>
    </div>
  );
}
