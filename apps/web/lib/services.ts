"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type Service = {
  id: string;
  title: string;
  description: string;
  rate: string;
  status: "ACTIVE" | "PENDING" | "PAUSED";
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

export function usePublicServices() {
  const api = useApi();
  return useQuery({
    queryKey: ["services", "public"],
    queryFn: async () => {
      const res = await api<Service[]>("/services");
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
    mutationFn: async (payload: { title: string; description: string; rate: string }) => {
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
    mutationFn: async (payload: { title: string; description: string; rate: string }) => {
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
