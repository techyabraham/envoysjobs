"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApplications } from "@/lib/applications";

export default function Page() {
  const { data, isLoading, error } = useApplications();

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Applications" description="Track your active applications.">
        {isLoading && <p className="text-foreground-secondary">Loading applications...</p>}
        {error && <p className="text-destructive">Failed to load applications.</p>}
        {!isLoading && data?.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-foreground-secondary">No applications yet.</p>
          </div>
        )}
        <div className="grid gap-4">
          {data?.map((app) => (
            <div key={app.id} className="bg-white border border-border rounded-2xl p-5">
              <p className="text-sm text-foreground-tertiary">Job ID: {app.jobId}</p>
              <p className="text-sm text-foreground-tertiary">Status: {app.status}</p>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
