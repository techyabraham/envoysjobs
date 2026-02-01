import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Edit Profile" description="Update your skills and bio.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input className="input" placeholder="Headline" />
          <textarea className="input min-h-[120px]" placeholder="Bio" />
          <button className="cta">Save changes</button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
