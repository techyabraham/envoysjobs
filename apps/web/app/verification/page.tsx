import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Verification" description="Track your verification status.">
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <p className="text-foreground-secondary">Phone verification: Complete</p>
        <p className="text-foreground-secondary">Steward verification: Pending</p>
        <button className="cta">Upload ID</button>
      </div>
    </PageShell>
  );
}
