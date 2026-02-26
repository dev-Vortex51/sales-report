import { apiClient } from "@core/api-client";
import type {
  CreateSaleRequest,
  CreateSaleResponse,
  SaleDetail,
  SalesListResponse,
} from "../types/sales.types";

interface ApiEnvelope<T> {
  data: T;
}

interface ApiListEnvelope<T, M> {
  data: T;
  meta: M;
}

export async function createSale(data: CreateSaleRequest): Promise<CreateSaleResponse> {
  const res = await apiClient.post<ApiEnvelope<CreateSaleResponse>>(
    "/sales",
    data,
  );
  return res.data.data;
}

export async function getSaleById(id: string): Promise<SaleDetail> {
  const res = await apiClient.get<ApiEnvelope<SaleDetail>>(`/sales/${id}`);
  return res.data.data;
}

export async function listSales(params: {
  from?: string;
  to?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<SalesListResponse> {
  const res = await apiClient.get<
    ApiListEnvelope<SalesListResponse["data"], SalesListResponse["meta"]>
  >("/sales", { params });
  return {
    data: res.data.data,
    meta: res.data.meta,
  };
}

export async function downloadReceiptPdf(saleId: string): Promise<string> {
  const res = await apiClient.get<Blob>(`/sales/${saleId}/receipt`, {
    responseType: "blob",
  });
  return URL.createObjectURL(res.data);
}
