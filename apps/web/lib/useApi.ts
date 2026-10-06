"use client";

import { getSession, useSession } from "next-auth/react";
import { useCallback } from "react";
import { apiFetch } from "@/lib/api";

export function useApi() {
  const { data } = useSession();
  const accessToken = (data as any)?.accessToken;

  return useCallback(async function authedFetch<T>(path: string, init?: RequestInit) {
    const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
    const request = (token?: string) => {
      const headers: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(init?.headers ? (init.headers as Record<string, string>) : {})
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      return apiFetch<T>(path, { ...init, headers });
    };

    const result = await request(accessToken);
    if (result.status !== 401) return result;

    // Session hydration and short-lived API tokens can race a dashboard action.
    // Refresh the NextAuth session once, then retry with its rotated API token.
    try {
      const refreshedSession = await getSession();
      const refreshedToken = (refreshedSession as any)?.accessToken as string | undefined;
      if (refreshedToken && refreshedToken !== accessToken) {
        return request(refreshedToken);
      }
    } catch {
      // Keep the original, actionable API error if refreshing is unavailable.
    }
    return result;
  }, [accessToken]);
}
