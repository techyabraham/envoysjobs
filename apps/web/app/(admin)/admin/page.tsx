"use client";

import { useMemo } from "react";
import { AdminDashboard, type AdminStat, type PendingItem } from "@envoysjobs/ui";
import { AlertTriangle, Users as UsersIcon, Briefcase, Wrench } from "lucide-react";
import {
  useAdminJobs,
  useAdminReports,
  useAdminUsers,
  useAdminVerifications,
  useUpdateStewardStatus,
  useUpdateVerificationStatus
} from "@/lib/admin";
import { usePublicServices } from "@/lib/services";

export default function Page() {
  const users = useAdminUsers();
  const jobs = useAdminJobs();
  const reports = useAdminReports();
  const verifications = useAdminVerifications();
  const services = usePublicServices();
  const updateSteward = useUpdateStewardStatus();
  const updateVerification = useUpdateVerificationStatus();

  const stats = useMemo<AdminStat[]>(() => {
    const totalUsers = users.data?.length ?? 0;
    const activeJobs = jobs.data?.filter((job) => job.status === "PUBLISHED").length ?? 0;
    const pendingReviews =
      (reports.data?.length ?? 0) +
      (verifications.data?.filter((v) => v.status === "PENDING").length ?? 0);
    const activeServices = services.data?.length ?? 0;
    return [
      { label: "Pending Reviews", value: String(pendingReviews), icon: AlertTriangle, color: "text-soft-gold" },
      { label: "Total Users", value: String(totalUsers), icon: UsersIcon, color: "text-deep-blue" },
      { label: "Active Jobs", value: String(activeJobs), icon: Briefcase, color: "text-emerald-green" },
      { label: "Active Services", value: String(activeServices), icon: Wrench, color: "text-deep-blue" }
    ];
  }, [users.data, jobs.data, reports.data, verifications.data, services.data]);

  const pendingItems = useMemo<PendingItem[]>(() => {
    const pendingVerifications = (verifications.data ?? [])
      .filter((item) => item.status === "PENDING")
      .map((item) => ({
        id: `verification:${item.id}`,
        type: "user" as const,
        title: "Verification request",
        submittedBy: item.phone,
        submittedDate: "Pending",
        status: "pending" as const,
        details: "Phone verification pending"
      }));

    const pendingStewards = (users.data ?? [])
      .filter((user) => user.stewardStatus === "PENDING")
      .map((user) => ({
        id: `steward:${user.id}`,
        type: "user" as const,
        title: "Steward verification",
        submittedBy: `${user.firstName} ${user.lastName}`,
        submittedDate: "Pending",
        status: "pending" as const,
        details: "Steward verification pending"
      }));

    const pendingReports = (reports.data ?? []).map((report) => ({
      id: `report:${report.id}`,
      type: "report" as const,
      title: "User report",
      submittedBy: report.reporterId,
      submittedDate: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Pending",
      status: "pending" as const,
      details: report.reason
    }));

    return [...pendingVerifications, ...pendingStewards, ...pendingReports];
  }, [verifications.data, users.data, reports.data]);

  const handleApprove = (id: string) => {
    if (id.startsWith("verification:")) {
      const verificationId = id.replace("verification:", "");
      updateVerification.mutate({ id: verificationId, status: "VERIFIED" });
      return;
    }
    if (id.startsWith("steward:")) {
      const userId = id.replace("steward:", "");
      updateSteward.mutate({ userId, status: "VERIFIED" });
      return;
    }
  };

  const handleReject = (id: string) => {
    if (id.startsWith("verification:")) {
      const verificationId = id.replace("verification:", "");
      updateVerification.mutate({ id: verificationId, status: "REJECTED" });
      return;
    }
    if (id.startsWith("steward:")) {
      const userId = id.replace("steward:", "");
      updateSteward.mutate({ userId, status: "REJECTED" });
      return;
    }
  };

  return (
    <AdminDashboard
      stats={stats}
      pendingItems={pendingItems}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
