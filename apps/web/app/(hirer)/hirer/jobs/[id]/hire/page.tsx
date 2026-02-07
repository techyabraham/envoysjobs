"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApplications, useUpdateApplicationStatus } from "@/lib/applications";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const { data, isLoading, error } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  const applications = data?.filter((app) => app.jobId === jobId) ?? [];

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Hire an Envoy" description="Select the best envoy for this job.">
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
                <p className="text-sm text-foreground-tertiary">Envoy ID: {app.envoyId}</p>
                <p className="text-sm text-foreground-tertiary">Status: {app.status}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: app.id, status: "HIRED" })}
                >
                  Hire
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: app.id, status: "REJECTED" })}
                >
                  Reject
                </button>
                <button className="btn-secondary" onClick={() => router.push(`/hirer/jobs/${jobId}/complete`)}>
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
