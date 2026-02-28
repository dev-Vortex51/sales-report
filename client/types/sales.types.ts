/** Shared types for the sales module. */

export interface SaleItem {
  item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

export interface SaleItemResponse extends SaleItem {
  id: string;
  line_total_before_tax: number;
  tax_amount: number;
  line_total: number;
}

export interface CreateSaleRequest {
  items: SaleItem[];
  customer_name?: string;
  customer_email?: string;
  currency?: string;
}

export interface SaleSummary {
  id: string;
  receipt_number: string;
  sale_timestamp: string;
  customer_name: string | null;
  total_amount: number;
  status: "COMPLETED" | "REFUNDED" | "VOID";
}

export interface SaleDetail extends SaleSummary {
  branch_id: string;
  user_id: string;
  customer_email: string | null;
  total_before_tax: number;
  tax_amount: number;
  items: SaleItemResponse[];
}

export interface SalesListResponse {
  data: SaleSummary[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}

export interface CreateSaleResponse {
  sale_id: string;
  receipt_number: string;
  total_amount: number;
  tax_amount: number;
  created_at: string;
}
