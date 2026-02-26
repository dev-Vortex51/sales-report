import type { SaleStatus } from "@prisma/client";
import { ApiError } from "../../shared/errors/api-error.js";
import { renderReceiptPdf } from "../../shared/services/pdf.service.js";
import type { AuthUser } from "../../shared/types/http.js";
import {
  addMoney,
  money,
  percent,
  toMoneyNumber,
} from "../../shared/utils/money.js";
import {
  countSales,
  createSaleGraph,
  findBranchForSale,
  findSaleByIdWithItems,
  findSaleReceiptContextById,
  findSalesPage,
  findSettingForReceipt,
} from "./sales.repository.js";

interface CreateSaleItemInput {
  item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

interface CreateSaleInput {
  branch_id?: string;
  items: CreateSaleItemInput[];
  customer_name?: string;
  customer_email?: string;
  currency?: string;
}

function generateReceiptNumber(now = new Date()) {
  const iso = now
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `RCPT-${iso}-${suffix}`;
}

export async function createSale(input: CreateSaleInput, user: AuthUser) {
  const branch = await findBranchForSale(input.branch_id);

  if (!branch) {
    throw new ApiError(400, "No active branch configured", "BRANCH_NOT_FOUND");
  }

  const computedItems = input.items.map((item) => {
    const unitPrice = money(item.unit_price);
    const qty = item.quantity;
    const lineTotalBeforeTax = unitPrice.mul(qty);
    const taxAmount = lineTotalBeforeTax.mul(percent(item.tax_rate)).div(100);
    const lineTotal = lineTotalBeforeTax.plus(taxAmount);

    return {
      itemId: item.item_id,
      description: item.description,
      quantity: item.quantity,
      unitPrice,
      taxRate: item.tax_rate,
      lineTotalBeforeTax,
      taxAmount,
      lineTotal,
    };
  });

  const totalBeforeTax = addMoney(
    ...computedItems.map((item) => item.lineTotalBeforeTax),
  );
  const taxAmount = addMoney(...computedItems.map((item) => item.taxAmount));
  const totalAmount = addMoney(totalBeforeTax, taxAmount);

  const sale = await createSaleGraph({
    branchId: branch.id,
    userId: user.id,
    totalBeforeTax: toMoneyNumber(totalBeforeTax),
    taxAmount: toMoneyNumber(taxAmount),
    totalAmount: toMoneyNumber(totalAmount),
    currency: (input.currency ?? "USD").toUpperCase(),
    customerName: input.customer_name,
    customerEmail: input.customer_email,
    receiptNumber: generateReceiptNumber(),
    items: computedItems.map((item) => ({
      itemId: item.itemId,
      description: item.description,
      quantity: item.quantity,
      unitPrice: toMoneyNumber(item.unitPrice),
      taxRate: item.taxRate,
      lineTotalBeforeTax: toMoneyNumber(item.lineTotalBeforeTax),
      taxAmount: toMoneyNumber(item.taxAmount),
      lineTotal: toMoneyNumber(item.lineTotal),
    })),
  });

  return {
    sale_id: sale.id,
    receipt_number: sale.receiptNumber,
    total_amount: Number(sale.totalAmount),
    tax_amount: Number(sale.taxAmount),
    created_at: sale.createdAt.toISOString(),
  };
}

export async function getSaleById(id: string) {
  const sale = await findSaleByIdWithItems(id);

  if (!sale) {
    throw new ApiError(404, "Sale not found", "SALE_NOT_FOUND");
  }

  return {
    id: sale.id,
    receipt_number: sale.receiptNumber,
    sale_timestamp: sale.saleTimestamp.toISOString(),
    customer_name: sale.customerName,
    total_amount: Number(sale.totalAmount),
    status: sale.status,
    branch_id: sale.branchId,
    user_id: sale.userId,
    customer_email: sale.customerEmail,
    total_before_tax: Number(sale.totalBeforeTax),
    tax_amount: Number(sale.taxAmount),
    items: sale.items.map((item) => ({
      id: item.id,
      item_id: item.itemId,
      description: item.description,
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      tax_rate: Number(item.taxRate),
      line_total_before_tax: Number(item.lineTotalBeforeTax),
      tax_amount: Number(item.taxAmount),
      line_total: Number(item.lineTotal),
    })),
  };
}

export async function listSales(query: {
  from?: string;
  to?: string;
  status?: SaleStatus;
  page: number;
  page_size: number;
}) {
  const where = {
    status: query.status,
    saleTimestamp:
      query.from || query.to
        ? {
            gte: query.from ? new Date(query.from) : undefined,
            lte: query.to ? new Date(query.to) : undefined,
          }
        : undefined,
  };

  const [total, sales] = await Promise.all([
    countSales(where),
    findSalesPage({ where, page: query.page, pageSize: query.page_size }),
  ]);

  return {
    data: sales.map((sale) => ({
      id: sale.id,
      receipt_number: sale.receiptNumber,
      sale_timestamp: sale.saleTimestamp.toISOString(),
      customer_name: sale.customerName,
      total_amount: Number(sale.totalAmount),
      status: sale.status,
    })),
    meta: {
      page: query.page,
      page_size: query.page_size,
      total,
    },
  };
}

export async function getReceiptPayload(id: string) {
  const sale = await findSaleReceiptContextById(id);

  if (!sale) {
    throw new ApiError(404, "Sale not found", "SALE_NOT_FOUND");
  }

  const settings = await findSettingForReceipt(sale.userId);

  return renderReceiptPdf({
    receiptNumber: sale.receiptNumber,
    date: sale.saleTimestamp,
    businessName: settings?.businessName ?? "My Business",
    businessAddress: settings?.businessAddress ?? "",
    branchName: sale.branch.name,
    cashierName: sale.user.name,
    customerName: sale.customerName ?? "Walk-in",
    currency: sale.currency,
    items: sale.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
    subtotal: Number(sale.totalBeforeTax),
    taxAmount: Number(sale.taxAmount),
    total: Number(sale.totalAmount),
    footer: settings?.receiptFooter ?? "Thank you for your business.",
  });
}
