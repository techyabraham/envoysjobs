"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ENVOY" | "HIRER" | "ADMIN";
  stewardStatus?: "PENDING" | "VERIFIED" | "REJECTED";
};

export type AdminJob = {
  id: string;
  title: string;
  status: string;
  hirerId: string;
};

export type AdminReport = {
  id: string;
  reporterId: string;
  reason: string;
  createdAt?: string;
};

export type AdminVerification = {
  id: string;
  phone: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
};

export function useAdminUsers() {
  const api = useApi();
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api<AdminUser[]>("/admin/users");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useAdminJobs() {
  const api = useApi();
  return useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const res = await api<AdminJob[]>("/admin/jobs");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useAdminReports() {
  const api = useApi();
  return useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const res = await api<AdminReport[]>("/admin/reports");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useUpdateAdminJobStatus() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; status: "DRAFT" | "PUBLISHED" | "CLOSED" }) => {
      const res = await api(`/admin/jobs/${params.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: params.status })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
    }
  });
}

export function useResolveReport() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: string) => {
      const res = await api(`/admin/reports/${reportId}`, { method: "DELETE" });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    }
  });
}

export function useAdminVerifications() {
  const api = useApi();
  return useQuery({
    queryKey: ["admin-verifications"],
    queryFn: async () => {
      const res = await api<AdminVerification[]>("/admin/verifications");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useUpdateStewardStatus() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { userId: string; status: "PENDING" | "VERIFIED" | "REJECTED" }) => {
      const res = await api(`/admin/stewards/${params.userId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: params.status })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    }
  });
}

export function useUpdateVerificationStatus() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; status: "PENDING" | "VERIFIED" | "REJECTED" }) => {
      const res = await api(`/admin/verifications/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: params.status })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
    }
  });
}

export function useAdminCreateJob() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      locationType: "ONSITE" | "REMOTE" | "HYBRID";
      location?: string;
      salaryMin?: number;
      salaryMax?: number;
      urgency?: string;
      status?: "DRAFT" | "PUBLISHED" | "CLOSED";
    }) => {
      const res = await api("/admin/jobs", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
    }
  });
}

export function useAdminCreateService() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; description: string; rate: string }) => {
      const res = await api("/admin/services", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", "public"] });
    }
  });
}

export function useAdminCreateGig() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      amount: string;
      location: string;
      duration: string;
      urgent?: boolean;
    }) => {
      const res = await api("/admin/gigs", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs", "available"] });
    }
  });
}
