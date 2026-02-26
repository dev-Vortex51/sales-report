import { prisma } from "../../config/prisma.js";

export function findSettingByOwnerUserId(ownerUserId: string) {
  return prisma.setting.findFirst({ where: { ownerUserId } });
}

export function createSetting(data: {
  ownerUserId: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  email: string;
  currency: string;
  defaultTaxRate: number;
  receiptFooter: string;
}) {
  return prisma.setting.create({ data });
}

export function updateSettingById(
  id: string,
  data: {
    businessName?: string;
    businessAddress?: string;
    phone?: string;
    email?: string;
    currency?: string;
    defaultTaxRate?: number;
    receiptFooter?: string;
  },
) {
  return prisma.setting.update({ where: { id }, data });
}

export function listAllBranches() {
  return prisma.branch.findMany({ orderBy: { createdAt: "asc" } });
}

export function createBranchRecord(data: {
  name: string;
  address: string;
  timezone: string;
  isActive: boolean;
}) {
  return prisma.branch.create({ data });
}

export function findBranchById(id: string) {
  return prisma.branch.findUnique({ where: { id } });
}

export function updateBranchById(
  id: string,
  data: { name?: string; address?: string; isActive?: boolean },
) {
  return prisma.branch.update({ where: { id }, data });
}
