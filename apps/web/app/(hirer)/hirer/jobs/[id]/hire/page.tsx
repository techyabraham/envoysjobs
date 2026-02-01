import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Hire Flow" description="Finalize your offer.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <p>Confirm hire details and send the offer.</p>
          <button className="cta">Send offer</button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
