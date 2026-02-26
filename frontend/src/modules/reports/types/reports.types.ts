/** Shared types for the reports module. */

export interface DailySummary {
  date: string;
  transaction_count: number;
  total_revenue: number;
  total_tax: number;
  average_basket: number;
}

export interface RecentSale {
  id: string;
  receipt_number: string;
  sale_timestamp: string;
  customer_name: string | null;
  item_count: number;
  total_amount: number;
  status: "COMPLETED" | "REFUNDED" | "VOID";
}

export interface DashboardMetrics {
  today: DailySummary;
  yesterday: DailySummary;
  weekly_trend: DailySummary[];
  top_items: TopItem[];
  recent_sales: RecentSale[];
}

export interface TopItem {
  description: string;
  quantity_sold: number;
  total_revenue: number;
}

export interface WeeklyReport {
  week_start: string;
  week_end: string;
  daily_breakdown: DailySummary[];
  top_items: TopItem[];
  totals: {
    transaction_count: number;
    total_revenue: number;
    total_tax: number;
    average_basket: number;
  };
}
