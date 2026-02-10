"use client";

import PageShell from "@/components/PageShell";
import { useAdminJobs, useUpdateAdminJobStatus } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminJobs();
  const updateStatus = useUpdateAdminJobStatus();

  return (
    <PageShell title="Admin Jobs" description="Review posted jobs.">
      {isLoading && <p className="text-foreground-secondary">Loading jobs...</p>}
      {error && <p className="text-destructive">Failed to load jobs.</p>}
      <div className="grid gap-4">
        {data?.map((job) => (
          <div key={job.id} className="bg-white border border-border rounded-2xl p-5 space-y-3">
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm text-foreground-tertiary">Status: {job.status}</p>
            <p className="text-sm text-foreground-tertiary">Hirer ID: {job.hirerId}</p>
            <div className="flex flex-wrap gap-2">
              <button
                className="btn-secondary"
                onClick={() => updateStatus.mutate({ id: job.id, status: "PUBLISHED" })}
              >
                Publish
              </button>
              <button
                className="btn-secondary"
                onClick={() => updateStatus.mutate({ id: job.id, status: "CLOSED" })}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
