import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Verifications" description="Approve or reject stewardship verification.">
      <div className="bg-white border border-border rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Grace Nwosu</p>
            <p className="text-sm text-foreground-secondary">Media Department</p>
          </div>
          <div className="flex gap-2">
            <button className="ghost">Reject</button>
            <button className="cta">Approve</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
