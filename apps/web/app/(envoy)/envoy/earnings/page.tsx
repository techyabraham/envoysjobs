"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Earnings" description="Track your payouts and earnings.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">Coming soon. Earnings tracking will appear here once payments are enabled.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
