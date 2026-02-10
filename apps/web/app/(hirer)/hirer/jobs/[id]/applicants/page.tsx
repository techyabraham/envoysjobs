"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApplications, useUpdateApplicationStatus } from "@/lib/applications";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const params = useParams();
  const jobId = params?.id as string;
  const { data, isLoading, error } = useApplications(jobId);
  const updateStatus = useUpdateApplicationStatus();

  const applications = data ?? [];

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Applicants" description="Review and manage applications.">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick links</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/hirer/jobs/${jobId}/preview`} className="btn-secondary">Job Preview</Link>
            <Link href="/hirer/jobs" className="btn-secondary">Manage Jobs</Link>
          </div>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading applicants...</p>}
        {error && <p className="text-destructive">Failed to load applicants.</p>}
        {!isLoading && applications.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-foreground-secondary">No applications yet.</p>
          </div>
        )}
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <div>
                <p className="text-sm text-foreground-tertiary">
                  Envoy: {app.envoy ? `${app.envoy.firstName} ${app.envoy.lastName}` : app.envoyId}
                </p>
                <p className="text-sm text-foreground-tertiary">Status: {app.status}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: app.id, status: "IN_REVIEW" })}
                >
                  Mark In Review
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: app.id, status: "HIRED" })}
                >
                  Mark Hired
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: app.id, status: "REJECTED" })}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
