"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useCloseJob, useHirerJobs, usePublishJob } from "@/lib/jobs";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();
  const userId = (session as any)?.user?.id as string | undefined;
  const { data, isLoading, error } = useHirerJobs(userId);
  const publishJob = usePublishJob();
  const closeJob = useCloseJob();

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Manage Jobs" description="Track applications and status.">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick links</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/hirer/jobs/new" className="btn-secondary">Post a Job</Link>
            <Link href="/hirer/shortlist" className="btn-secondary">Envoy Shortlist</Link>
          </div>
        </div>
        {!userId && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-foreground-secondary">Sign in to manage your jobs.</p>
          </div>
        )}
        {isLoading && <p className="text-foreground-secondary">Loading jobs...</p>}
        {error && <p className="text-destructive">Failed to load jobs.</p>}
        <div className="grid gap-4">
          {data?.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <div>
                <h3 className="text-xl mb-1">{job.title}</h3>
                <p className="text-foreground-secondary">{job.locationType}</p>
                <p className="text-sm text-foreground-tertiary">Status: {job.status}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/hirer/jobs/${job.id}/preview`} className="btn-secondary">
                  Preview
                </Link>
                <Link href={`/hirer/jobs/${job.id}/applicants`} className="btn-secondary">
                  Applicants
                </Link>
                {job.status !== "PUBLISHED" && (
                  <button className="btn-secondary" onClick={() => publishJob.mutate(job.id)}>
                    Publish
                  </button>
                )}
                {job.status === "PUBLISHED" && (
                  <button className="btn-secondary" onClick={() => closeJob.mutate(job.id)}>
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
