"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type Gig = {
  id: string;
  title: string;
  amount: string;
  location: string;
  duration: string;
  urgent: boolean;
  status: "AVAILABLE" | "APPLIED" | "ONGOING" | "COMPLETED";
  postedById: string;
  createdAt: string;
  updatedAt: string;
  postedBy?: { firstName: string; lastName: string };
};

export function useAvailableGigs() {
  const api = useApi();
  return useQuery({
    queryKey: ["gigs", "available"],
    queryFn: async () => {
      const res = await api<Gig[]>("/gigs?excludeMine=true");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useMyGigs() {
  const api = useApi();
  return useQuery({
    queryKey: ["gigs", "mine"],
    queryFn: async () => {
      const res = await api<Gig[]>("/gigs/mine");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useAppliedGigs() {
  const api = useApi();
  return useQuery({
    queryKey: ["gigs", "applied"],
    queryFn: async () => {
      const res = await api<{ id: string; status: string; createdAt: string; gig: Gig }[]>("/gigs/applied");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useCreateGig() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; amount: string; location: string; duration: string; urgent?: boolean }) => {
      const res = await api<Gig>("/gigs", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs", "available"] });
      queryClient.invalidateQueries({ queryKey: ["gigs", "mine"] });
    }
  });
}

export function useApplyToGig() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gigId: string) => {
      const res = await api<{ id: string }>(`/gigs/${gigId}/apply`, { method: "POST" });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs", "available"] });
      queryClient.invalidateQueries({ queryKey: ["gigs", "applied"] });
    }
  });
}
