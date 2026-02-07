"use client";

import { useParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useJob } from "@/lib/jobs";
import { useApi } from "@/lib/useApi";
import { useSaveJob } from "@/lib/savedJobs";

export default function Page() {
  const params = useParams();
  const jobId = params?.id as string;
  const { data: job, isLoading, error } = useJob(jobId);
  const api = useApi();
  const saveJob = useSaveJob();

  const handleApply = async () => {
    if (!jobId) return;
    const res = await api(`/jobs/${jobId}/apply`, { method: "POST" });
    if (res.error) {
      alert("Failed to apply.");
      return;
    }
    alert("Application sent.");
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title={job?.title ?? "Job Details"} description={job?.description}>
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
            <div className="flex gap-3">
              <button onClick={handleApply} className="px-4 py-2 rounded-lg bg-emerald-green text-white">
                Apply
              </button>
              <button onClick={() => saveJob.mutate(job.id)} className="btn-secondary">
                Save job
              </button>
            </div>
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
