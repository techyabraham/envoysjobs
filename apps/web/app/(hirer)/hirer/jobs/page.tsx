import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { mockJobs } from "@/lib/mockData";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Manage Jobs" description="Track applications and status.">
        <div className="grid gap-4">
          {mockJobs.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-xl mb-1">{job.title}</h3>
              <p className="text-foreground-secondary">{job.company}</p>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
