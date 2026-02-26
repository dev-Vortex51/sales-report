/** Shared types for the settings module. */

export interface Branch {
  id: string;
  name: string;
  address: string;
  is_active: boolean;
  created_at: string;
}

export interface BusinessSettings {
  business_name: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  tax_rate: number;
  receipt_footer: string;
}

export interface UpdateBusinessSettingsRequest {
  business_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency?: string;
  tax_rate?: number;
  receipt_footer?: string;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
}
