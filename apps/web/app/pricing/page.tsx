import PageShell from "@/components/PageShell";

export default function Page() {
  if (process.env.NEXT_PUBLIC_ENABLE_BILLING !== "true") {
    return (
      <PageShell title="Pricing" description="Monetization coming soon.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">Pricing plans will launch soon.</p>
        </div>
      </PageShell>
    );
  }
  return (
    <PageShell title="Pricing" description="Choose a plan">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-xl">Starter</h3>
          <p className="text-foreground-secondary">Community listings</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-xl">Premium</h3>
          <p className="text-foreground-secondary">Priority visibility</p>
        </div>
      </div>
    </PageShell>
  );
}
