export interface SaleItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Completed' | 'Voided';
}

export interface DailySale {
  day: string;
  revenue: number;
  sales: number;
  avgSale: number;
}

export interface TrendData {
  day: string;
  revenue: number;
}

export interface TopItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

// Mock receipts for history
export const mockReceipts: Receipt[] = [
  {
    id: '1',
    receiptNumber: 'REC-001',
    date: new Date(2025, 1, 25, 10, 30),
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    items: [
      { id: '1', description: 'Premium Coffee', quantity: 2, unitPrice: 15, taxRate: 20 },
      { id: '2', description: 'Croissant', quantity: 3, unitPrice: 8, taxRate: 20 },
    ],
    subtotal: 54,
    tax: 10.8,
    total: 64.8,
    status: 'Completed',
  },
  {
    id: '2',
    receiptNumber: 'REC-002',
    date: new Date(2025, 1, 25, 11, 45),
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    items: [
      { id: '1', description: 'Espresso Shot', quantity: 1, unitPrice: 12, taxRate: 20 },
    ],
    subtotal: 12,
    tax: 2.4,
    total: 14.4,
    status: 'Completed',
  },
  {
    id: '3',
    receiptNumber: 'REC-003',
    date: new Date(2025, 1, 25, 13, 20),
    customerName: 'Mike Chen',
    customerEmail: 'mike@example.com',
    items: [
      { id: '1', description: 'Iced Latte', quantity: 1, unitPrice: 18, taxRate: 20 },
      { id: '2', description: 'Muffin', quantity: 2, unitPrice: 10, taxRate: 20 },
    ],
    subtotal: 38,
    tax: 7.6,
    total: 45.6,
    status: 'Completed',
  },
  {
    id: '4',
    receiptNumber: 'REC-004',
    date: new Date(2025, 1, 25, 14, 15),
    customerName: 'Emma Davis',
    customerEmail: 'emma@example.com',
    items: [
      { id: '1', description: 'Cappuccino', quantity: 3, unitPrice: 16, taxRate: 20 },
    ],
    subtotal: 48,
    tax: 9.6,
    total: 57.6,
    status: 'Voided',
  },
  {
    id: '5',
    receiptNumber: 'REC-005',
    date: new Date(2025, 1, 24, 9, 30),
    customerName: 'Alex Wong',
    customerEmail: 'alex@example.com',
    items: [
      { id: '1', description: 'Americano', quantity: 2, unitPrice: 14, taxRate: 20 },
      { id: '2', description: 'Cookie', quantity: 4, unitPrice: 6, taxRate: 20 },
    ],
    subtotal: 52,
    tax: 10.4,
    total: 62.4,
    status: 'Completed',
  },
  {
    id: '6',
    receiptNumber: 'REC-006',
    date: new Date(2025, 1, 24, 12, 45),
    customerName: 'Lisa Martinez',
    customerEmail: 'lisa@example.com',
    items: [
      { id: '1', description: 'Macchiato', quantity: 1, unitPrice: 17, taxRate: 20 },
      { id: '2', description: 'Scone', quantity: 2, unitPrice: 9, taxRate: 20 },
    ],
    subtotal: 35,
    tax: 7,
    total: 42,
    status: 'Completed',
  },
];

// Daily sales data for the week
export const mockDailySales: DailySale[] = [
  { day: 'Monday', revenue: 450, sales: 18, avgSale: 25 },
  { day: 'Tuesday', revenue: 520, sales: 22, avgSale: 23.6 },
  { day: 'Wednesday', revenue: 480, sales: 20, avgSale: 24 },
  { day: 'Thursday', revenue: 600, sales: 25, avgSale: 24 },
  { day: 'Friday', revenue: 720, sales: 30, avgSale: 24 },
  { day: 'Saturday', revenue: 850, sales: 35, avgSale: 24.3 },
  { day: 'Sunday', revenue: 380, sales: 16, avgSale: 23.75 },
];

// Trend data for charts
export const mockTrendData: TrendData[] = [
  { day: 'Mon', revenue: 450 },
  { day: 'Tue', revenue: 520 },
  { day: 'Wed', revenue: 480 },
  { day: 'Thu', revenue: 600 },
  { day: 'Fri', revenue: 720 },
  { day: 'Sat', revenue: 850 },
  { day: 'Sun', revenue: 380 },
];

// Top selling items
export const mockTopItems: TopItem[] = [
  { id: '1', name: 'Premium Coffee', quantity: 45, revenue: 675 },
  { id: '2', name: 'Cappuccino', quantity: 38, revenue: 608 },
  { id: '3', name: 'Croissant', quantity: 52, revenue: 416 },
  { id: '4', name: 'Iced Latte', quantity: 28, revenue: 504 },
  { id: '5', name: 'Muffin', quantity: 35, revenue: 350 },
];

// KPI data for today
export const mockKPIData = {
  totalRevenue: 282,
  totalSales: 11,
  avgSale: 25.6,
  totalTax: 56.4,
  revenueGrowth: 12,
  salesGrowth: 5,
  avgSaleGrowth: -2,
  taxGrowth: 8,
};
