import PageShell from "@/components/PageShell";
import Link from "next/link";

export default function Page() {
  if (process.env.NEXT_PUBLIC_ENABLE_BILLING !== "true") {
    return (
      <PageShell title="Billing" description="Monetization coming soon.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <p className="text-foreground-secondary">Billing will be available soon.</p>
          <div>
            <p className="text-sm text-foreground-tertiary mb-3">Coming soon</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/billing/history" className="btn-secondary">Payment History</Link>
              <Link href="/billing/wallet" className="btn-secondary">Wallet</Link>
            </div>
          </div>
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
