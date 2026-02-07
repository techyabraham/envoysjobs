"use client";

import PageShell from "@/components/PageShell";
import { useAdminReports } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminReports();

  return (
    <PageShell title="Admin Reports" description="Flagged activity and reports.">
      {isLoading && <p className="text-foreground-secondary">Loading reports...</p>}
      {error && <p className="text-destructive">Failed to load reports.</p>}
      <div className="grid gap-4">
        {data?.map((report) => (
          <div key={report.id} className="bg-white border border-border rounded-2xl p-5">
            <p className="font-semibold">Report {report.id}</p>
            <p className="text-sm text-foreground-tertiary">Reporter: {report.reporterId}</p>
            <p className="text-sm text-foreground-secondary">{report.reason}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
