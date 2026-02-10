import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Verification Badges" description="Understand what each badge means.">
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-lg">Verified Envoy</h3>
          <p className="text-foreground-secondary">
            This badge means the Envoy has completed identity checks and phone verification.
          </p>
        </div>
        <div>
          <h3 className="text-lg">Steward (Pending Verification)</h3>
          <p className="text-foreground-secondary">
            The Envoy has declared stewardship and is awaiting confirmation by admins.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
