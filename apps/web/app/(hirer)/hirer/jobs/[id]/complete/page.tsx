import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Complete Job" description="Mark the job as complete.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <button className="cta">Mark complete</button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
