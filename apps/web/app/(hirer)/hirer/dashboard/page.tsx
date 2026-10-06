"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApplications } from "@/lib/applications";
import { useApi } from "@/lib/useApi";
import { useHirerJobs } from "@/lib/jobs";
import { useConversations } from "@/lib/messaging";
import { useNotifications } from "@/lib/notifications";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  const api = useApi();
  const name = (session as any)?.user?.name || "Hirer";
  const userId = (session as any)?.user?.id as string | undefined;
  const jobs = useHirerJobs(userId);
  const applications = useApplications();
  const conversations = useConversations(userId);
  const notifications = useNotifications();
  const hirerProfile = useQuery({
    queryKey: ["hirer-profile-dashboard"],
    queryFn: async () => {
      const res = await api<any>("/hirer/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    enabled: Boolean(userId)
  });
  const isRecruiter = Boolean(hirerProfile.data?.isRecruiter);

  return (
    <DashboardShell userName={name}>
      <PageShell title="Dashboard" description="Manage hiring and connect with the member marketplace.">
        {[jobs.error, applications.error, conversations.error, notifications.error, hirerProfile.error].filter(Boolean).map((error, index) => (
          <p key={index} role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{(error as Error).message || "Some dashboard information could not be loaded."}</p>
        ))}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Jobs Posted" value={jobs.data?.length ?? 0} />
          <StatCard label="Applications" value={applications.data?.length ?? 0} />
          <StatCard label="Conversations" value={conversations.data?.length ?? 0} />
          <StatCard label="Notifications" value={notifications.data?.length ?? 0} />
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick actions</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/hirer/jobs/new" className="btn-secondary">Post a Job</Link>
            <Link href="/hirer/jobs" className="btn-secondary">Manage Jobs</Link>
            <Link href="/hirer/shortlist" className="btn-secondary">Envoy Shortlist</Link>
            <Link href="/services" className="btn-secondary">Browse Services</Link>
            <Link href="/gigs" className="btn-secondary">Browse Gigs</Link>
            <Link href="/deals" className="btn-secondary">Community Deals</Link>
            <Link href={isRecruiter ? "/hirer/recruitment" : "/hirer/become-recruiter"} className="btn-secondary">
              {isRecruiter ? "Recruitment" : "Become a Recruiter"}
            </Link>
          </div>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
