import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Post a new job" description="Share a trusted opportunity with Envoys.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input className="input" placeholder="Job title" />
          <textarea className="input min-h-[120px]" placeholder="Job description" />
          <button className="cta">Publish</button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
