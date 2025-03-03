export class FetchError extends Error {
  constructor(
    public response: Response,
    public data: { error: string; message: string },
  ) {
    super(data.message || "Failed fetching to API");
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  requiresAuth?: boolean;
}

export async function fetcher(
  endpoint: string,
  options: FetchOptions = { requiresAuth: true },
) {
  const { params, headers, requiresAuth = true, ...rest } = options;
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...rest,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new FetchError(response, data);
  }

  return data;
}
