"use client";

import PageShell from "@/components/PageShell";
import AdminGate from "@/components/admin/AdminGate";
import { useAdminVerifications, useUpdateVerificationStatus } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminVerifications();
  const updateVerification = useUpdateVerificationStatus();

  return (
    <AdminGate>
      <PageShell title="Admin Verifications" description="Review verification requests.">
        {isLoading && <p className="text-foreground-secondary">Loading verifications...</p>}
        {error && <p className="text-destructive">Failed to load verifications.</p>}
        <div className="grid gap-4">
          {data?.map((verification) => (
            <div key={verification.id} className="bg-white border border-border rounded-2xl p-5 space-y-2">
              <p className="font-semibold">{verification.phone}</p>
              <p className="text-sm text-foreground-tertiary">Status: {verification.status}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => updateVerification.mutate({ id: verification.id, status: "VERIFIED" })}
                  disabled={verification.status === "VERIFIED"}
                >
                  Approve
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateVerification.mutate({ id: verification.id, status: "REJECTED" })}
                  disabled={verification.status === "REJECTED"}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </AdminGate>
  );
}
