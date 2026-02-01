import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="My Profile" description="Your public profile for hirers.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl">Grace Nwosu</h3>
              <p className="text-foreground-secondary">Content Writer</p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-soft-gold/20 text-soft-gold-dark">
              Steward (Pending Verification)
            </span>
          </div>
          <p className="text-foreground-secondary">
            Passionate about storytelling and community impact.
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-background-secondary text-sm">SEO</span>
            <span className="px-3 py-1 rounded-full bg-background-secondary text-sm">Copywriting</span>
          </div>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
