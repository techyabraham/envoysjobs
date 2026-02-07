"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type Job = {
  id: string;
  title: string;
  description: string;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  urgency?: string | null;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  hirerId: string;
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
