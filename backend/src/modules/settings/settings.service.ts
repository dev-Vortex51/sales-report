import { ApiError } from "../../shared/errors/api-error.js";
import type { AuthUser } from "../../shared/types/http.js";
import {
  createBranchRecord,
  createSetting,
  findBranchById,
  findSettingByOwnerUserId,
  listAllBranches,
  updateBranchById,
  updateSettingById,
} from "./settings.repository.js";

interface UpdateSettingsInput {
  business_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency?: string;
  tax_rate?: number;
  receipt_footer?: string;
}

interface BranchInput {
  name: string;
  address: string;
}

interface UpdateBranchInput {
  name?: string;
  address?: string;
  is_active?: boolean;
}

function ensureOwner(user: AuthUser) {
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden", "AUTH_FORBIDDEN");
  }
}

function toSettingsResponse(setting: {
  businessName: string;
  businessAddress: string;
  phone: string;
  email: string;
  currency: string;
  defaultTaxRate: unknown;
  receiptFooter: string;
}) {
  return {
    business_name: setting.businessName,
    address: setting.businessAddress,
    phone: setting.phone,
    email: setting.email,
    currency: setting.currency,
    tax_rate: Number(setting.defaultTaxRate),
    receipt_footer: setting.receiptFooter,
  };
}

function toBranchResponse(branch: {
  id: string;
  name: string;
  address: string | null;
  isActive: boolean;
  createdAt: Date;
}) {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address ?? "",
    is_active: branch.isActive,
    created_at: branch.createdAt.toISOString(),
  };
}

export async function getBusinessSettings(user: AuthUser) {
  ensureOwner(user);

  let setting = await findSettingByOwnerUserId(user.id);

  if (!setting) {
    setting = await createSetting({
      ownerUserId: user.id,
      businessName: "My Business",
      businessAddress: "",
      phone: "",
      email: user.email,
      currency: "USD",
      defaultTaxRate: 0,
      receiptFooter: "Thank you for your business",
    });
  }

  return toSettingsResponse(setting);
}

export async function updateBusinessSettings(
  input: UpdateSettingsInput,
  user: AuthUser,
) {
  ensureOwner(user);

  const current = await findSettingByOwnerUserId(user.id);

  const setting = current
    ? await updateSettingById(current.id, {
        businessName: input.business_name,
        businessAddress: input.address,
        phone: input.phone,
        email: input.email,
        currency: input.currency,
        defaultTaxRate: input.tax_rate,
        receiptFooter: input.receipt_footer,
      })
    : await createSetting({
        ownerUserId: user.id,
        businessName: input.business_name ?? "My Business",
        businessAddress: input.address ?? "",
        phone: input.phone ?? "",
        email: input.email ?? user.email,
        currency: input.currency ?? "USD",
        defaultTaxRate: input.tax_rate ?? 0,
        receiptFooter: input.receipt_footer ?? "Thank you for your business",
      });

  return toSettingsResponse(setting);
}

export async function listBranches(user: AuthUser) {
  ensureOwner(user);

  const branches = await listAllBranches();

  return branches.map(toBranchResponse);
}

export async function createBranch(input: BranchInput, user: AuthUser) {
  ensureOwner(user);

  const branch = await createBranchRecord({
    name: input.name,
    address: input.address,
    timezone: "UTC",
    isActive: true,
  });

  return toBranchResponse(branch);
}

export async function updateBranch(
  id: string,
  input: UpdateBranchInput,
  user: AuthUser,
) {
  ensureOwner(user);

  const existing = await findBranchById(id);
  if (!existing) {
    throw new ApiError(404, "Branch not found", "BRANCH_NOT_FOUND");
  }

  const branch = await updateBranchById(id, {
    name: input.name,
    address: input.address,
    isActive: input.is_active,
  });

  return toBranchResponse(branch);
}
