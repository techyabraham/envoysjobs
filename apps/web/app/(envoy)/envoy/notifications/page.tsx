import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Notifications" description="Stay updated with your activity.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">No new notifications.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
