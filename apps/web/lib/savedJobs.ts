"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useApi } from "@/lib/useApi";
import type { Job } from "@/lib/jobs";

export function useSavedJobs() {
  const api = useApi();
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  return useQuery({
    queryKey: ["saved-jobs"],
    enabled: status === "authenticated" && Boolean(accessToken),
    queryFn: async () => {
      const res = await api<Job[]>("/jobs/saved");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useSaveJob() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await api(`/jobs/${jobId}/save`, { method: "POST" });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    }
  });
}

export function useUnsaveJob() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await api(`/jobs/${jobId}/save`, { method: "DELETE" });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    }
  });
}
