"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Page() {
  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Settings" description="Manage your account preferences.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Link href="/notifications/preferences" className="btn-secondary">Notification Preferences</Link>
            <Link href="/verification" className="btn-secondary">Verification</Link>
          </div>
          <button className="btn-secondary" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
            Sign out
          </button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
