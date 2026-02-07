"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type ApplicationStatus =
  | "APPLIED"
  | "IN_REVIEW"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

export type Application = {
  id: string;
  jobId: string;
  envoyId: string;
  status: ApplicationStatus;
  createdAt?: string;
};

export function useApplications() {
  const api = useApi();
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await api<Application[]>("/applications");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useUpdateApplicationStatus() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; status: ApplicationStatus }) => {
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
