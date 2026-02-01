import PageShell from "@/components/PageShell";

export default function Page() {
  if (process.env.NEXT_PUBLIC_ENABLE_BILLING !== "true") {
    return (
      <PageShell title="Billing" description="Monetization coming soon.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">Billing will be available soon.</p>
        </div>
      </PageShell>
    );
  }
  return (
    <PageShell title="Billing" description="Manage your subscription.">
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-foreground-secondary">No active subscription.</p>
      </div>
    </PageShell>
  );
}
