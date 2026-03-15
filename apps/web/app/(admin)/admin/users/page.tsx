"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import AdminGate from "@/components/admin/AdminGate";
import { useAdminUsers, useUpdateStewardStatus } from "@/lib/admin";

export default function Page() {
  const { data, isLoading, error } = useAdminUsers();
  const updateSteward = useUpdateStewardStatus();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ENVOY" | "HIRER" | "ADMIN">("ALL");

  const filtered = useMemo(() => {
    return (data ?? []).filter((user) => {
      const matchesQuery = `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [data, query, roleFilter]);

  return (
    <AdminGate>
      <PageShell title="Admin Users" description="Manage Envoys and Hirers.">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-3">
          <input
            className="input"
            placeholder="Search name or email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="input md:max-w-[220px]"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as any)}
          >
            <option value="ALL">All Roles</option>
            <option value="ENVOY">Envoys</option>
            <option value="HIRER">Hirers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading users...</p>}
        {error && <p className="text-destructive">Failed to load users.</p>}
        <div className="grid gap-4">
          {filtered.map((user) => (
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
                  disabled={user.stewardStatus === "VERIFIED" || updateSteward.isPending}
                >
                  Verify Steward
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateSteward.mutate({ userId: user.id, status: "REJECTED" })}
                  disabled={user.stewardStatus === "REJECTED" || updateSteward.isPending}
                >
                  Reject Steward
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => updateSteward.mutate({ userId: user.id, status: "PENDING" })}
                  disabled={user.stewardStatus === "PENDING" || updateSteward.isPending}
                >
                  Set Pending
                </button>
              </div>
            </div>
          ))}
          {!isLoading && !error && filtered.length === 0 ? (
            <p className="text-sm text-foreground-tertiary">No users found for the current filter.</p>
          ) : null}
        </div>
      </PageShell>
    </AdminGate>
  );
}
