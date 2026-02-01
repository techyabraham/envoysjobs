import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Saved Jobs" description="Your bookmarked opportunities.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">No saved jobs yet.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
