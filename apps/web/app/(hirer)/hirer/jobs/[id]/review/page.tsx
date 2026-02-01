import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Leave a review" description="Rate your experience.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <textarea className="input min-h-[120px]" placeholder="Share feedback" />
          <button className="cta">Submit review</button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
