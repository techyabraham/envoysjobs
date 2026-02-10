"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useSavedJobs, useUnsaveJob } from "@/lib/savedJobs";
import Link from "next/link";

export default function Page() {
  const { data, isLoading, error } = useSavedJobs();
  const unsave = useUnsaveJob();

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Saved Jobs" description="Opportunities you've bookmarked.">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick links</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/envoy/jobs" className="btn-secondary">Browse Jobs</Link>
            <Link href="/envoy/applications" className="btn-secondary">Applications</Link>
          </div>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading saved jobs...</p>}
        {error && <p className="text-destructive">Failed to load saved jobs.</p>}
        {!isLoading && data?.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-foreground-secondary">No saved jobs yet.</p>
          </div>
        )}
        <div className="grid gap-4">
          {data?.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <Link href={`/envoy/jobs/${job.id}`}>
                <h3 className="text-xl mb-1">{job.title}</h3>
              </Link>
              <p className="text-foreground-secondary">{job.locationType}</p>
              <button className="btn-secondary" onClick={() => unsave.mutate(job.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
