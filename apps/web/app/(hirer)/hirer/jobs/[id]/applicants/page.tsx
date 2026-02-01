import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Applicants" description="Review candidates for this job.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">No applicants yet.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
