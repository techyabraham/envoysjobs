"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export const DEAL_CATEGORIES = ["Food & drink", "Shopping", "Health & beauty", "Home & lifestyle", "Professional services", "Events", "Other"] as const;
export type DealCategory = (typeof DEAL_CATEGORIES)[number];
export type Deal = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  offer: string;
  category: DealCategory;
  promoCode?: string | null;
  redemptionInstructions: string;
  location?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  status: "PENDING" | "ACTIVE" | "PAUSED" | "REJECTED";
  contactMethods: string[];
  contactEmail?: string | null;
  contactWebsite?: string | null;
  contactWhatsapp?: string | null;
  createdAt: string;
  owner?: { id: string; firstName: string; lastName: string };
};
export type DealPayload = Omit<Deal, "id" | "ownerId" | "status" | "createdAt" | "owner">;

export function useDeals(query?: string, category?: string, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: ["deals", query ?? "", category ?? ""],
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
      const suffix = params.size ? `?${params.toString()}` : "";
      const res = await api<Deal[]>(`/deals${suffix}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useMyDeals(enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: ["deals", "mine"], enabled,
    queryFn: async () => {
      const res = await api<Deal[]>("/deals/mine");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useDeal(id?: string, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: ["deals", id], enabled: Boolean(id) && enabled,
    queryFn: async () => {
      const res = await api<Deal>(`/deals/${id}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useCreateDeal() {
  const api = useApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<DealPayload>) => {
      const res = await api<Deal>("/deals", { method: "POST", body: JSON.stringify(payload) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["deals"] });
    }
  });
}

export function useUpdateDealStatus() {
  const api = useApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "ACTIVE" | "PAUSED" }) => {
      const res = await api<Deal>(`/deals/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["deals"] })
  });
}
