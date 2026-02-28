import { apiClient } from "@core/api-client";
import type {
  BusinessSettings,
  UpdateBusinessSettingsRequest,
  Branch,
  CreateBranchRequest,
} from "../../frontend/src/modules/settings/types/settings.types";

interface ApiEnvelope<T> {
  data: T;
}

/* ── Business settings ── */

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const res = await apiClient.get<ApiEnvelope<BusinessSettings>>("/settings");
  return res.data.data;
}

export async function updateBusinessSettings(
  data: UpdateBusinessSettingsRequest,
): Promise<BusinessSettings> {
  const res = await apiClient.patch<ApiEnvelope<BusinessSettings>>(
    "/settings",
    data,
  );
  return res.data.data;
}

/* ── Branches ── */

export async function listBranches(): Promise<Branch[]> {
  const res = await apiClient.get<ApiEnvelope<Branch[]>>("/branches");
  return res.data.data;
}

export async function createBranch(data: CreateBranchRequest): Promise<Branch> {
  const res = await apiClient.post<ApiEnvelope<Branch>>("/branches", data);
  return res.data.data;
}

export async function updateBranch(
  id: string,
  data: Partial<CreateBranchRequest & { is_active: boolean }>,
): Promise<Branch> {
  const res = await apiClient.patch<ApiEnvelope<Branch>>(
    `/branches/${id}`,
    data,
  );
  return res.data.data;
}
