import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Job preview" description="Review how your job appears to Envoys.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-xl">Senior Software Engineer</h3>
          <p className="text-foreground-secondary">Tech Solutions Ltd · Lagos</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
