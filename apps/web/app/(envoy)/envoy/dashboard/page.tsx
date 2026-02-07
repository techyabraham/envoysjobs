"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useJobs } from "@/lib/jobs";
import { useApplications } from "@/lib/applications";
import { useConversations } from "@/lib/messaging";
import { useNotifications } from "@/lib/notifications";
import { useSession } from "next-auth/react";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <p className="text-sm text-foreground-tertiary">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

export default function Page() {
  const { data: session } = useSession();
  const name = (session as any)?.user?.name || "Envoy";
  const userId = (session as any)?.user?.id as string | undefined;
  const jobs = useJobs();
  const applications = useApplications();
  const conversations = useConversations(userId);
  const notifications = useNotifications();

  return (
    <DashboardShell userName={name}>
      <PageShell title="Dashboard" description="Overview of your Envoy activity.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Available Jobs" value={jobs.data?.length ?? 0} />
          <StatCard label="Applications" value={applications.data?.length ?? 0} />
          <StatCard label="Conversations" value={conversations.data?.length ?? 0} />
          <StatCard label="Notifications" value={notifications.data?.length ?? 0} />
        </div>
      </PageShell>
    </DashboardShell>
  );
}
