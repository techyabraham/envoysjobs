"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApplications } from "@/lib/applications";
import Link from "next/link";

export default function Page() {
  const { data, isLoading, error } = useApplications();

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Applications" description="Track your active applications.">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick links</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/envoy/history" className="btn-secondary">Job History</Link>
            <Link href="/envoy/saved" className="btn-secondary">Saved Jobs</Link>
          </div>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading applications...</p>}
        {error && <p className="text-destructive">Failed to load applications.</p>}
        {!isLoading && data?.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-foreground-secondary">No applications yet.</p>
          </div>
        )}
        <div className="grid gap-4">
          {data?.map((app) => (
            <div key={app.id} className="bg-white border border-border rounded-2xl p-5 space-y-2">
              <p className="font-semibold">{app.job?.title ?? "Job"}</p>
              <p className="text-sm text-foreground-tertiary">Status: {app.status}</p>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
