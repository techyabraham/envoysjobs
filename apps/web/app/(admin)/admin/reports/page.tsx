"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import AdminGate from "@/components/admin/AdminGate";
import { useAdminReports, useResolveReport } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminReports();
  const resolveReport = useResolveReport();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return (data ?? []).filter((report) => {
      const hay = `${report.reporterId} ${report.reason}`.toLowerCase();
      return hay.includes(query.toLowerCase());
    });
  }, [data, query]);

  return (
    <AdminGate>
      <PageShell title="Admin Reports" description="Flagged activity and reports.">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4">
          <input
            className="input"
            placeholder="Search reports"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading reports...</p>}
        {error && <p className="text-destructive">Failed to load reports.</p>}
        <div className="grid gap-4">
          {filtered.map((report) => (
            <div key={report.id} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <p className="font-semibold">Report {report.id}</p>
              <p className="text-sm text-foreground-tertiary">Reporter: {report.reporterId}</p>
              <p className="text-sm text-foreground-secondary">{report.reason}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => resolveReport.mutate(report.id)}
                  disabled={resolveReport.isPending}
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
          {!isLoading && !error && filtered.length === 0 ? (
            <p className="text-sm text-foreground-tertiary">No reports found.</p>
          ) : null}
        </div>
      </PageShell>
    </AdminGate>
  );
}
