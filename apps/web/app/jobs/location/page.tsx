"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobDiscoveryPage } from "@envoysjobs/ui";
import { useJobs } from "@/lib/jobs";
import { useSavedJobs, useSaveJob, useUnsaveJob } from "@/lib/savedJobs";
import { mapJobToCard } from "@/lib/jobCards";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationQuery = (searchParams.get("q") || "").toLowerCase();
  const { data: jobs, isLoading, error } = useJobs();
  const { data: savedJobs } = useSavedJobs();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const savedIds = useMemo(() => (savedJobs ?? []).map((job) => job.id), [savedJobs]);
  const filtered = useMemo(() => {
    const source = jobs ?? [];
    if (!locationQuery) return source;
    return source.filter((job) => {
      const location = job.location ?? "";
      return location.toLowerCase().includes(locationQuery);
    });
  }, [jobs, locationQuery]);

  const mappedJobs = useMemo(() => filtered.map(mapJobToCard), [filtered]);

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
