"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApplications } from "@/lib/applications";
import Link from "next/link";

export default function Page() {
  const { data, isLoading, error } = useApplications();

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Job History" description="Your applications and completed work.">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick links</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/envoy/jobs" className="btn-secondary">Browse Jobs</Link>
            <Link href="/envoy/applications" className="btn-secondary">Applications</Link>
          </div>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading history...</p>}
        {error && <p className="text-destructive">Failed to load history.</p>}

        <div className="grid gap-4">
          {(data ?? []).filter((app) => ["HIRED", "REJECTED", "OFFER", "COMPLETED"].includes(app.status)).map((app) => (
            <div key={app.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg">{app.job?.title ?? "Job"}</h3>
                  <p className="text-sm text-foreground-secondary">Status: {app.status}</p>
                </div>
                <span className="text-sm text-foreground-tertiary">
                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>
          ))}
          {(data ?? []).length === 0 && !isLoading && (
            <p className="text-foreground-secondary">No job history yet.</p>
          )}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
