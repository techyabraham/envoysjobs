"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useJob } from "@/lib/jobs";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const jobId = params?.id as string;
  const { data: job, isLoading, error } = useJob(jobId);

  return (
    <DashboardShell userName="Daniel">
      <PageShell title={job?.title ?? "Job Preview"} description={job?.description}>
        {isLoading && <p className="text-foreground-secondary">Loading job...</p>}
        {error && <p className="text-destructive">Failed to load job.</p>}
        {job ? (
          <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
            <div className="text-sm text-foreground-tertiary">
              {job.locationType} ? {job.location ?? "Remote"}
            </div>
            <div className="text-sm text-foreground-tertiary">
              Salary: {job.salaryMin ?? 0} - {job.salaryMax ?? 0}
            </div>
            <div className="text-sm text-foreground-tertiary">Status: {job.status}</div>
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
