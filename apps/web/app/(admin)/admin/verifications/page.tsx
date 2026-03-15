"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import AdminGate from "@/components/admin/AdminGate";
import { useAdminVerifications, useUpdateVerificationStatus } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminVerifications();
  const updateVerification = useUpdateVerificationStatus();
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "VERIFIED" | "REJECTED">("ALL");

  const filtered = useMemo(() => {
    return (data ?? []).filter((verification) => {
      return statusFilter === "ALL" || verification.status === statusFilter;
    });
  }, [data, statusFilter]);

  return (
    <AdminGate>
      <PageShell title="Admin Verifications" description="Review verification requests.">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4">
          <select
            className="input md:max-w-[220px]"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading verifications...</p>}
        {error && <p className="text-destructive">Failed to load verifications.</p>}
        <div className="grid gap-4">
          {filtered.map((verification) => (
            <div key={verification.id} className="bg-white border border-border rounded-2xl p-5 space-y-2">
              <p className="font-semibold">{verification.phone}</p>
              <p className="text-sm text-foreground-tertiary">Status: {verification.status}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => updateVerification.mutate({ id: verification.id, status: "VERIFIED" })}
                  disabled={verification.status === "VERIFIED" || updateVerification.isPending}
                >
                  Approve
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateVerification.mutate({ id: verification.id, status: "REJECTED" })}
                  disabled={verification.status === "REJECTED" || updateVerification.isPending}
                >
                  Reject
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateVerification.mutate({ id: verification.id, status: "PENDING" })}
                  disabled={verification.status === "PENDING" || updateVerification.isPending}
                >
                  Set Pending
                </button>
              </div>
            </div>
          ))}
          {!isLoading && !error && filtered.length === 0 ? (
            <p className="text-sm text-foreground-tertiary">No verification records found.</p>
          ) : null}
        </div>
      </PageShell>
    </AdminGate>
  );
}
