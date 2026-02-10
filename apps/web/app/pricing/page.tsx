import PageShell from "@/components/PageShell";
import Link from "next/link";

export default function Page() {
  if (process.env.NEXT_PUBLIC_ENABLE_BILLING !== "true") {
    return (
      <PageShell title="Pricing" description="Monetization coming soon.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <p className="text-foreground-secondary">Pricing plans will launch soon.</p>
          <div>
            <p className="text-sm text-foreground-tertiary mb-3">Explore upcoming options</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pricing/boost" className="btn-secondary">Premium Envoy Boost</Link>
              <Link href="/pricing/featured" className="btn-secondary">Featured Job Posting</Link>
            </div>
          </div>
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
