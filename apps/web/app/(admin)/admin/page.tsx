"use client";

import { useMemo, useState } from "react";
import { AdminDashboard, type AdminStat, type PendingItem } from "@envoysjobs/ui";
import { AlertTriangle, Users as UsersIcon, Briefcase, Wrench } from "lucide-react";
import { signOut } from "next-auth/react";
import AdminGate from "@/components/admin/AdminGate";
import {
  useAdminCreateGig,
  useAdminCreateJob,
  useAdminCreateService,
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
  const createJob = useAdminCreateJob();
  const createService = useAdminCreateService();
  const createGig = useAdminCreateGig();
  const [jobTitle, setJobTitle] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [gigTitle, setGigTitle] = useState("");
  const [adminError, setAdminError] = useState<string | null>(null);

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
    <AdminGate>
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            className="btn-secondary"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            Logout
          </button>
        </div>
        <AdminDashboard
          stats={stats}
          pendingItems={pendingItems}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="text-xl font-semibold mb-4">Create from Admin Backend</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form
              className="space-y-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setAdminError(null);
                try {
                  await createJob.mutateAsync({
                    title: jobTitle,
                    description: "Admin created job posting",
                    locationType: "ONSITE",
                    location: "Nigeria",
                    status: "PUBLISHED"
                  });
                  setJobTitle("");
                } catch (error: any) {
                  setAdminError(error?.message || "Failed to create job");
                }
              }}
            >
              <h3 className="font-medium">New Job</h3>
              <input className="input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job title" required />
              <button className="cta" type="submit" disabled={createJob.isPending}>
                {createJob.isPending ? "Creating..." : "Create Job"}
              </button>
            </form>

            <form
              className="space-y-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setAdminError(null);
                try {
                  await createService.mutateAsync({
                    title: serviceTitle,
                    description: "Admin-created service listing.",
                    rate: "₦50,000"
                  });
                  setServiceTitle("");
                } catch (error: any) {
                  setAdminError(error?.message || "Failed to create service");
                }
              }}
            >
              <h3 className="font-medium">New Service</h3>
              <input className="input" value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} placeholder="Service title" required />
              <button className="cta" type="submit" disabled={createService.isPending}>
                {createService.isPending ? "Creating..." : "Create Service"}
              </button>
            </form>

            <form
              className="space-y-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setAdminError(null);
                try {
                  await createGig.mutateAsync({
                    title: gigTitle,
                    description: "Admin-created gig opportunity.",
                    amount: "₦25,000",
                    location: "Nigeria",
                    duration: "4 hours"
                  });
                  setGigTitle("");
                } catch (error: any) {
                  setAdminError(error?.message || "Failed to create gig");
                }
              }}
            >
              <h3 className="font-medium">New Gig</h3>
              <input className="input" value={gigTitle} onChange={(e) => setGigTitle(e.target.value)} placeholder="Gig title" required />
              <button className="cta" type="submit" disabled={createGig.isPending}>
                {createGig.isPending ? "Creating..." : "Create Gig"}
              </button>
            </form>
          </div>
          {adminError && <p className="text-sm text-destructive mt-3">{adminError}</p>}
        </div>
      </div>
    </AdminGate>
  );
}
