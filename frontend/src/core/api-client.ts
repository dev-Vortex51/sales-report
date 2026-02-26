import axios from "axios";
import { config } from "@core/config";
import { store } from "@core/store";

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((req) => {
  const token = store.getState().auth.token;
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Global response error handler
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token expired or invalid — redirect to login
      store.dispatch({ type: "auth/logout" });
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
