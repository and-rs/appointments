import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";
interface RequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
  method?: Method;
}

class ApiClient {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private getAuthHeader(): { Authorization?: string } {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async fetch<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = false, method = "get", ...rest } = config;
    const response = await this.client.request({
      url,
      method,
      headers: {
        ...(requiresAuth ? this.getAuthHeader() : {}),
      },
      ...rest,
    });
    return response.data;
  }

  async request<T>(url: string, config: RequestConfig = {}) {
    const controller = new AbortController();
    try {
      const data = await this.fetch<T>(url, {
        ...config,
        signal: controller.signal,
      });
      return {
        data,
        error: null,
        abort: () => controller.abort(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null,
          error: {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
          },
          abort: () => controller.abort(),
        };
      }
      return {
        data: null,
        error: {
          message: "An unexpected error occurred",
          status: 500,
        },
        abort: () => controller.abort(),
      };
    }
  }
}
export const api = new ApiClient();
