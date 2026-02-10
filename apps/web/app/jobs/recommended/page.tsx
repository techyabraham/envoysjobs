"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { JobDiscoveryPage } from "@envoysjobs/ui";
import { useJobs } from "@/lib/jobs";
import { useSavedJobs, useSaveJob, useUnsaveJob } from "@/lib/savedJobs";
import { mapJobToCard } from "@/lib/jobCards";

export default function Page() {
  const router = useRouter();
  const { data: jobs, isLoading, error } = useJobs();
  const { data: savedJobs } = useSavedJobs();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const savedIds = useMemo(() => (savedJobs ?? []).map((job) => job.id), [savedJobs]);
  const mappedJobs = useMemo(
    () => (jobs ?? []).slice(0, 4).map(mapJobToCard),
    [jobs]
  );

  if (isLoading && mappedJobs.length === 0) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center text-foreground-secondary">
        Loading jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center text-destructive">
        Failed to load jobs.
      </div>
    );
  }

  return (
    <JobDiscoveryPage
      jobs={mappedJobs}
      savedJobIds={savedIds}
      onJobClick={(jobId) => router.push(`/jobs/${jobId}`)}
      onToggleSave={(jobId) => {
        if (savedIds.includes(jobId)) {
          unsaveJob.mutate(jobId);
        } else {
          saveJob.mutate(jobId);
        }
      }}
    />
  );
}
