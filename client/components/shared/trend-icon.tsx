import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendIconProps {
  trend: string | undefined;
  isPositive: boolean;
}

export function TrendIcon({ trend, isPositive }: TrendIconProps) {
  if (isPositive) {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  }
  return <TrendingDown className="h-4 w-4 text-red-600" />;
}

// h-4 w-4 text-green-600"
// h-4 w-4 text-red-600"
