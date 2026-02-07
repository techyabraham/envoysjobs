import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Gigs" description="Short-term opportunities and gigs.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">Gig listings coming soon.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
