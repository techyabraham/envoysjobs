"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import type { ContactMethod } from "@/lib/contact";

export type Job = {
  id: string;
  title: string;
  description: string;
  company?: string | null;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  urgency?: string | null;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  hirerId: string;
  source?: string | null;
  sourceId?: string | null;
  sourceUrl?: string | null;
  applyUrl?: string | null;
  contactMethods?: ContactMethod[];
  contactEmail?: string | null;
  contactWebsite?: string | null;
  contactWhatsapp?: string | null;
};

export function useJobs() {
  const api = useApi();
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await api<Job[]>("/jobs?status=PUBLISHED");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useJob(id?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["jobs", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await api<Job>(`/jobs/${id}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useHirerJobs(hirerId?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["hirer-jobs", hirerId],
    enabled: Boolean(hirerId),
    queryFn: async () => {
      const res = await api<Job[]>(`/jobs?hirerId=${hirerId}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function usePublishJob() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await api(`/jobs/${jobId}/publish`, { method: "POST" });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hirer-jobs"] });
    }
  });
}

export function useCloseJob() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await api(`/jobs/${jobId}/close`, { method: "POST" });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hirer-jobs"] });
    }
  });
}
