"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Envoy Shortlist" description="Save Envoys you want to engage with.">
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">Your shortlisted Envoys will appear here.</p>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
