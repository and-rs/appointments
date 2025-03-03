import axios, { AxiosRequestConfig, Method } from "axios";

interface RequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
  method?: Method;
}

interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string;
    status?: number;
  } | null;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetcher = async <T>(
  url: string,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> => {
  const {
    requiresAuth = false,
    method = "get",
    headers = {},
    ...rest
  } = config;

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await api.request({
      url,
      method,
      headers,
      ...rest,
    });

    return {
      data: response.data.result,
      error: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        data: null,
        error: {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
        },
      };
    }

    return {
      data: null,
      error: {
        message: "An unexpected error occurred",
        status: 500,
      },
    };
  }
};
