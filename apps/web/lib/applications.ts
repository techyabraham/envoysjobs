"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type Application = {
  id: string;
  jobId: string;
  status: "APPLIED" | "IN_REVIEW" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";
  createdAt?: string;
  job?: { id: string; title: string } | null;
  envoy?: { id: string; firstName: string; lastName: string; email: string } | null;
  envoyId?: string;
};

export function useApplications(jobId?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["applications", jobId],
    queryFn: async () => {
      const res = await api<Application[]>(jobId ? `/applications?jobId=${jobId}` : "/applications");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useUpdateApplicationStatus() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; status: Application["status"] }) => {
      const res = await api(`/applications/${params.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: params.status })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });
}
