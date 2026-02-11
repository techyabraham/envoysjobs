"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobDetailsPage } from "@envoysjobs/ui";
import { useJob } from "@/lib/jobs";
import { useSavedJobs, useSaveJob, useUnsaveJob } from "@/lib/savedJobs";
import { useApi } from "@/lib/useApi";
import { useCreateConversation } from "@/lib/messaging";
import { useSession } from "next-auth/react";

function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) return "Negotiable";
  if (min != null && max != null) return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
  if (min != null) return `₦${min.toLocaleString()}`;
  return `₦${max?.toLocaleString()}`;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const api = useApi();
  const { data: session } = useSession();
  const createConversation = useCreateConversation();
  const jobId = typeof params?.id === "string" ? params.id : undefined;
  const { data: job, isLoading, error } = useJob(jobId);
  const { data: savedJobs } = useSavedJobs();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const savedIds = useMemo(() => (savedJobs ?? []).map((item) => item.id), [savedJobs]);
  const isSaved = jobId ? savedIds.includes(jobId) : false;

  const mappedJob = useMemo(() => {
    if (!job) return undefined;
    const locationLabel = job.location ?? (job.locationType === "REMOTE" ? "Remote" : "Onsite");
    const sourceLabel = job.source ?? "EnvoysJobs";
    return {
      id: job.id,
      title: job.title,
      company: job.company ?? "EnvoysJobs",
      location: locationLabel,
      locationType: job.locationType === "REMOTE" ? "Remote" : job.locationType === "HYBRID" ? "Hybrid" : "Onsite",
      salary: formatSalary(job.salaryMin, job.salaryMax),
      salaryPeriod: "per month",
      jobType: "Full-time",
      experienceLevel: "All levels",
      postedDate: "Recently",
      applicants: 0,
      views: 0,
      fromMember: !job.source,
      memberVerified: false,
      description: job.description ?? "",
      responsibilities: ["Deliver quality work and communicate clearly.", "Collaborate with the hirer to meet milestones."],
      requirements: ["Relevant experience for this role.", "Professional conduct and reliability."],
      niceToHave: ["Prior experience with similar projects."],
      benefits: ["Competitive compensation", "Clear scope and expectations"],
      skills: [],
      aboutCompany: "Company details will be shared after application.",
      companySize: "Not specified",
      companyIndustry: "Not specified",
      companyWebsite: "#",
      source: sourceLabel,
      sourceUrl: job.sourceUrl ?? undefined,
      applyUrl: job.applyUrl ?? undefined
    };
  }, [job]);

  if (isLoading && !mappedJob) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center text-foreground-secondary">
        Loading job...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center text-destructive">
        Failed to load job.
      </div>
    );
  }

  if (!mappedJob) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center text-foreground-secondary">
        Job not found.
      </div>
    );
  }

  return (
    <JobDetailsPage
      job={mappedJob}
      saved={isSaved}
      onBack={() => router.push("/jobs")}
      onToggleSave={(next) => {
        if (!jobId) return;
        if (next) {
          saveJob.mutate(jobId);
        } else {
          unsaveJob.mutate(jobId);
        }
      }}
      onMessage={async () => {
        if (!jobId || !job?.hirerId) return;
        const envoyId = (session as any)?.user?.id as string | undefined;
        if (!envoyId) return;
        const convo = await createConversation.mutateAsync({
          jobId,
          envoyId,
          hirerId: job.hirerId
        });
        if (convo?.id) router.push(`/messages/${convo.id}`);
      }}
      onApply={async () => {
        if (!jobId) return;
        if (job?.applyUrl) {
          window.open(job.applyUrl, "_blank", "noopener,noreferrer");
          return;
        }
        const res = await api(`/jobs/${jobId}/apply`, { method: "POST" });
        if (res.error) {
          alert("Failed to apply.");
        }
      }}
    />
  );
}
