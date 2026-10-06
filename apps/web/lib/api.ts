export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type ApiResult<T> = { data: T; error?: string; status?: number };

export function resolveAssetUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers || {})
    }
  });

  if (!res.ok) {
    const body = await res.text();
    let error = body || `Request failed (${res.status})`;
    try {
      const parsed = JSON.parse(body);
      const message = parsed?.message;
      if (Array.isArray(message)) error = message.join(", ");
      else if (typeof message === "string") error = message;
    } catch {
      // Keep the plain-text response when the API did not return JSON.
    }
    return { data: null as T, error, status: res.status };
  }

  return { data: (await res.json()) as T };
}
