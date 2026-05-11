"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobDiscoveryPage } from "@envoysjobs/ui";
import { useJobs } from "@/lib/jobs";
import { mapJobToCard } from "@/lib/jobCards";
import { useSavedJobs, useSaveJob, useUnsaveJob } from "@/lib/savedJobs";

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const { data: jobs, isLoading, error } = useJobs();
  const { data: savedJobs } = useSavedJobs();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const savedIds = useMemo(() => (savedJobs ?? []).map((job) => job.id), [savedJobs]);
  const mappedJobs = useMemo(() => {
    const base = (jobs ?? []).map(mapJobToCard);
    if (!query) return base;
    return base.filter((job) => {
      const haystack = [job.title, job.company, job.location, job.pay, job.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [jobs, query]);

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

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-secondary flex items-center justify-center text-foreground-secondary">
          Loading jobs...
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
