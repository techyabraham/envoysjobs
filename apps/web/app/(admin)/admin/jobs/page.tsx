"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import AdminGate from "@/components/admin/AdminGate";
import { useAdminJobs, useUpdateAdminJobStatus } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminJobs();
  const updateStatus = useUpdateAdminJobStatus();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED" | "CLOSED">("ALL");

  const filtered = useMemo(() => {
    return (data ?? []).filter((job) => {
      const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [data, query, statusFilter]);

  return (
    <AdminGate>
      <PageShell title="Admin Jobs" description="Review posted jobs.">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-3">
          <input
            className="input"
            placeholder="Search job title"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="input md:max-w-[220px]"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading jobs...</p>}
        {error && <p className="text-destructive">Failed to load jobs.</p>}
        <div className="grid gap-4">
          {filtered.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-foreground-tertiary">Status: {job.status}</p>
              <p className="text-sm text-foreground-tertiary">Hirer ID: {job.hirerId}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: job.id, status: "PUBLISHED" })}
                  disabled={job.status === "PUBLISHED" || updateStatus.isPending}
                >
                  Publish
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: job.id, status: "CLOSED" })}
                  disabled={job.status === "CLOSED" || updateStatus.isPending}
                >
                  Close
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus.mutate({ id: job.id, status: "DRAFT" })}
                  disabled={job.status === "DRAFT" || updateStatus.isPending}
                >
                  Move to Draft
                </button>
              </div>
            </div>
          ))}
          {!isLoading && !error && filtered.length === 0 ? (
            <p className="text-sm text-foreground-tertiary">No jobs found for the current filter.</p>
          ) : null}
        </div>
      </PageShell>
    </AdminGate>
  );
}
