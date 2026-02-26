import { prisma } from "../../config/prisma.js";

type SaleStatus = "COMPLETED" | "REFUNDED" | "VOID";

export function findBranchForSale(branchId?: string) {
  if (branchId) {
    return prisma.branch.findUnique({ where: { id: branchId } });
  }

  return prisma.branch.findFirst({ where: { isActive: true } });
}

export function createSaleGraph(input: {
  branchId: string;
  userId: string;
  totalBeforeTax: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  receiptNumber: string;
  items: Array<{
    itemId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    lineTotalBeforeTax: number;
    taxAmount: number;
    lineTotal: number;
  }>;
}) {
  return prisma.$transaction(async (tx) => {
    const createdSale = await tx.sale.create({
      data: {
        branchId: input.branchId,
        userId: input.userId,
        totalBeforeTax: input.totalBeforeTax,
        taxAmount: input.taxAmount,
        totalAmount: input.totalAmount,
        currency: input.currency,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        receiptNumber: input.receiptNumber,
      },
    });

    await tx.saleItem.createMany({
      data: input.items.map((item) => ({
        saleId: createdSale.id,
        itemId: item.itemId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        lineTotalBeforeTax: item.lineTotalBeforeTax,
        taxAmount: item.taxAmount,
        lineTotal: item.lineTotal,
      })),
    });

    await tx.receipt.create({
      data: {
        saleId: createdSale.id,
        pdfUrl: null,
      },
    });

    return createdSale;
  });
}

export function findSaleByIdWithItems(id: string) {
  return prisma.sale.findUnique({
    where: { id },
    include: { items: true },
  });
}

export function countSales(where: {
  status?: SaleStatus;
  saleTimestamp?: { gte?: Date; lte?: Date };
}) {
  return prisma.sale.count({ where });
}

export function findSalesPage(input: {
  where: {
    status?: SaleStatus;
    saleTimestamp?: { gte?: Date; lte?: Date };
  };
  page: number;
  pageSize: number;
}) {
  return prisma.sale.findMany({
    where: input.where,
    orderBy: { saleTimestamp: "desc" },
    skip: (input.page - 1) * input.pageSize,
    take: input.pageSize,
  });
}

export function findSaleReceiptContextById(id: string) {
  return prisma.sale.findUnique({
    where: { id },
    include: { items: true, branch: true, user: true },
  });
}

export function findSettingForReceipt(ownerUserId: string) {
  return prisma.setting.findFirst({ where: { ownerUserId } });
}
