import { prisma } from "../../config/prisma.js";

export function findBranchById(id: string) {
  return prisma.branch.findUnique({ where: { id } });
}

export function findFirstActiveBranch() {
  return prisma.branch.findFirst({ where: { isActive: true } });
}

export function findCompletedSalesInRange(input: {
  start: Date;
  end: Date;
  branchId?: string;
}) {
  return prisma.sale.findMany({
    where: {
      saleTimestamp: { gte: input.start, lt: input.end },
      status: "COMPLETED",
      branchId: input.branchId,
    },
    select: {
      taxAmount: true,
      totalAmount: true,
    },
  });
}

export function groupTopItemsByRevenue(input: {
  rangeStart: Date;
  rangeEnd: Date;
  branchId?: string;
}) {
  return prisma.saleItem.groupBy({
    by: ["description"],
    _sum: {
      quantity: true,
      lineTotal: true,
    },
    where: {
      sale: {
        saleTimestamp: { gte: input.rangeStart, lt: input.rangeEnd },
        status: "COMPLETED",
        branchId: input.branchId,
      },
    },
    orderBy: {
      _sum: {
        lineTotal: "desc",
      },
    },
    take: 5,
  });
}

export function findRecentCompletedSales(branchId?: string) {
  return prisma.sale.findMany({
    where: { status: "COMPLETED", branchId },
    orderBy: { saleTimestamp: "desc" },
    take: 10,
    include: {
      items: {
        select: { quantity: true },
      },
    },
  });
}

export function findFirstSettingByCreateAsc() {
  return prisma.setting.findFirst({
    orderBy: { createdAt: "asc" },
  });
}
