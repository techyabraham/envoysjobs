import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Envoy Profile" description="Review this Envoy before hiring.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-xl">Sarah Adeyemi</h3>
          <p className="text-foreground-secondary">Web Developer · 4.9 rating</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
