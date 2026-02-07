"use client";

import PageShell from "@/components/PageShell";
import { useAdminJobs } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminJobs();

  return (
    <PageShell title="Admin Jobs" description="Review posted jobs.">
      {isLoading && <p className="text-foreground-secondary">Loading jobs...</p>}
      {error && <p className="text-destructive">Failed to load jobs.</p>}
      <div className="grid gap-4">
        {data?.map((job) => (
          <div key={job.id} className="bg-white border border-border rounded-2xl p-5">
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm text-foreground-tertiary">Status: {job.status}</p>
            <p className="text-sm text-foreground-tertiary">Hirer ID: {job.hirerId}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
