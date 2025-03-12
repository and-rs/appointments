import axios, { AxiosRequestConfig, Method } from "axios";
interface RequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
  method?: Method;
}

class ApiClient {
  private constructor() {}
  private static _client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: {
      "Content-Type": "application/json",
    },
  });

  private static getAuthHeader(): { Authorization?: string } {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async fetch<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = false, method = "get", ...rest } = config;
    const response = await this._client.request({
      url,
      method,
      headers: {
        ...(requiresAuth ? this.getAuthHeader() : {}),
      },
      ...rest,
    });
    return response.data;
  }

  static async request<T>(url: string, config: RequestConfig = {}) {
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

export default ApiClient;
