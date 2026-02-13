"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import type { ContactMethod } from "@/lib/contact";

export type Service = {
  id: string;
  title: string;
  description: string;
  rate: string;
  imageUrl?: string | null;
  status: "ACTIVE" | "PENDING" | "PAUSED";
  contactMethods?: ContactMethod[];
  contactEmail?: string | null;
  contactWebsite?: string | null;
  contactWhatsapp?: string | null;
  createdAt: string;
  updatedAt: string;
  envoyId?: string;
  envoy?: { firstName: string; lastName: string };
};

export function useMyServices() {
  const api = useApi();
  return useQuery({
    queryKey: ["services", "me"],
    queryFn: async () => {
      const res = await api<Service[]>("/services/me");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useMyServicesAny(enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: ["services", "mine-any"],
    enabled,
    queryFn: async () => {
      const res = await api<Service[]>("/services/mine");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function usePublicServices(query?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["services", "public", query ?? ""],
    queryFn: async () => {
      const params = query?.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      const res = await api<Service[]>(`/services${params}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useService(id?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["services", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await api<Service>(`/services/${id}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useCreateService() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      rate: string;
      contactMethods?: ContactMethod[];
      contactEmail?: string;
      contactWebsite?: string;
      contactWhatsapp?: string;
    }) => {
      const res = await api<Service>("/services", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", "me"] });
    }
  });
}

export function useUpdateService(serviceId: string) {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title?: string;
      description?: string;
      rate?: string;
      contactMethods?: ContactMethod[];
      contactEmail?: string;
      contactWebsite?: string;
      contactWhatsapp?: string;
    }) => {
      const res = await api<Service>(`/services/${serviceId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", "me"] });
      queryClient.invalidateQueries({ queryKey: ["services", serviceId] });
    }
  });
}

export function useServiceInquiry(serviceId: string) {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { method?: ContactMethod; message?: string }) => {
      const res = await api<{ id: string }>(`/services/${serviceId}/inquiries`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", serviceId] });
    }
  });
}
