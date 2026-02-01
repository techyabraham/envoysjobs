import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Job Details" description="Senior Software Engineer">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <p>
            We are looking for a senior engineer to build trusted community platforms.
          </p>
          <button className="cta">Apply now</button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
