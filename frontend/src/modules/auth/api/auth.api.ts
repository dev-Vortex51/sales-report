import { apiClient } from "@core/api-client";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface ApiEnvelope<T> {
  data: T;
}

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<ApiEnvelope<LoginResponse>>("/auth/login", data);
  return res.data.data;
}
