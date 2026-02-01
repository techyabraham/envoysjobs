import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { mockJobs } from "@/lib/mockData";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Job Feed" description="Recommended jobs for you.">
        <div className="grid gap-4">
          {mockJobs.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-xl mb-1">{job.title}</h3>
              <p className="text-foreground-secondary">{job.company}</p>
              <div className="text-sm text-foreground-tertiary mt-2">
                {job.location} · {job.pay}
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
