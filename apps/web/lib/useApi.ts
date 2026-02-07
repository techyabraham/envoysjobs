"use client";

import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

export function useApi() {
  const { data } = useSession();
  const accessToken = (data as any)?.accessToken;

  return async function authedFetch<T>(path: string, init?: RequestInit) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers ? (init.headers as Record<string, string>) : {})
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return apiFetch<T>(path, { ...init, headers });
  };
}
