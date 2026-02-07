"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt?: string;
};

export function useNotifications() {
  const api = useApi();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api<Notification[]>("/notifications");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useMarkNotificationRead() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api(`/notifications/${id}/read`, { method: "PATCH" });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}
