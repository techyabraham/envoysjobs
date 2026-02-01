import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Settings" description="Manage your account preferences.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">Update your preferences here.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
