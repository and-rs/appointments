import axios, { AxiosRequestConfig } from "axios";

interface RequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetcher = async (url: string, config: RequestConfig = {}) => {
  const { requiresAuth = false, headers = {}, ...rest } = config;

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await api.get(url, {
    headers,
    ...rest,
  });

  return response.data;
};
