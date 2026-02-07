"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useJobs } from "@/lib/jobs";
import Link from "next/link";

export default function Page() {
  const { data, isLoading, error } = useJobs();

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Job Feed" description="Recommended jobs for you.">
        {isLoading && <p className="text-foreground-secondary">Loading jobs...</p>}
        {error && <p className="text-destructive">Failed to load jobs.</p>}
        <div className="grid gap-4">
          {data?.map((job) => (
            <Link
              key={job.id}
              href={`/envoy/jobs/${job.id}`}
              className="block bg-white border border-border rounded-2xl p-5 hover:border-emerald-green transition-colors"
            >
              <h3 className="text-xl mb-1">{job.title}</h3>
              <p className="text-foreground-secondary">{job.locationType}</p>
              <div className="text-sm text-foreground-tertiary mt-2">
                {job.location ?? "Remote"} ? {job.salaryMin ?? 0} - {job.salaryMax ?? 0}
              </div>
            </Link>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
