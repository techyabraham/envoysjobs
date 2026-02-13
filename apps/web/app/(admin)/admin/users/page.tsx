"use client";

import PageShell from "@/components/PageShell";
import AdminGate from "@/components/admin/AdminGate";
import { useAdminUsers, useUpdateStewardStatus } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminUsers();
  const updateSteward = useUpdateStewardStatus();

  return (
    <AdminGate>
      <PageShell title="Admin Users" description="Manage Envoys and Hirers.">
        {isLoading && <p className="text-foreground-secondary">Loading users...</p>}
        {error && <p className="text-destructive">Failed to load users.</p>}
        <div className="grid gap-4">
          {data?.map((user) => (
            <div key={user.id} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <div>
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-foreground-secondary">{user.email}</p>
                <p className="text-sm text-foreground-tertiary">Role: {user.role}</p>
                <p className="text-sm text-foreground-tertiary">Steward: {user.stewardStatus ?? "N/A"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => updateSteward.mutate({ userId: user.id, status: "VERIFIED" })}
                >
                  Verify Steward
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateSteward.mutate({ userId: user.id, status: "REJECTED" })}
                >
                  Reject Steward
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </AdminGate>
  );
}
