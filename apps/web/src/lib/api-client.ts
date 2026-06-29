const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<T> {
  const url = `${API_BASE_URL}/api/v1${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>("GET", endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>("POST", endpoint, body),
  patch: <T>(endpoint: string, body: unknown) => request<T>("PATCH", endpoint, body),
  del: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};

// Auth helpers
export async function login(email: string, password: string) {
  const data = await apiClient.post<{ access_token: string; user: { id: string; email: string; name: string; role: string } }>("/auth/login", { email, password });
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Mirror the cookie the middleware reads. Stop-gap until the backend
    // issues an HttpOnly cookie on /auth/login.
    document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
  }
}

export function getUser() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
}
