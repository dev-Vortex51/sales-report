"use client";

import axios from "axios";

import { store } from "./store";
import { config } from "./config";

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((req) => {
  const state = store.getState() as { auth: { token: string | null } };
  const token = state.auth.token;
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
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
