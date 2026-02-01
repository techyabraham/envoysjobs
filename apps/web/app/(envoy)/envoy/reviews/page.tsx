import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Reviews" description="Your feedback and ratings.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">No reviews yet.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
