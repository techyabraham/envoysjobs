"use client";

import PageShell from "@/components/PageShell";
import { useAdminJobs, useAdminReports, useAdminUsers, useAdminVerifications } from "@/lib/admin";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <p className="text-sm text-foreground-tertiary">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

export default function Page() {
  const users = useAdminUsers();
  const jobs = useAdminJobs();
  const reports = useAdminReports();
  const verifications = useAdminVerifications();

  return (
    <PageShell title="Admin Dashboard" description="Operational overview.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={users.data?.length ?? 0} />
        <StatCard label="Jobs" value={jobs.data?.length ?? 0} />
        <StatCard label="Reports" value={reports.data?.length ?? 0} />
        <StatCard label="Verifications" value={verifications.data?.length ?? 0} />
      </div>
    </PageShell>
  );
}
