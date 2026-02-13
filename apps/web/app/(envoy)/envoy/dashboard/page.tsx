"use client";

import DashboardShell from "@/components/DashboardShell";
import { DashboardOverview } from "@envoysjobs/ui";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useJobs } from "@/lib/jobs";
import { useApplications } from "@/lib/applications";
import { useConversations } from "@/lib/messaging";
import { Briefcase, Eye, MessageCircle, TrendingUp } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();
  const name = (session as any)?.user?.name || "Envoy";
  const userId = (session as any)?.user?.id as string | undefined;
  const router = useRouter();
  const { data: jobs } = useJobs();
  const { data: applications } = useApplications();
  const { data: conversations } = useConversations(userId);

  const applicationsCount = applications?.length ?? 0;
  const hiredCount = applications?.filter((item) => item.status === "HIRED").length ?? 0;
  const successRate = applicationsCount > 0 ? Math.round((hiredCount / applicationsCount) * 100) : 0;

  const unreadMessages = (conversations ?? []).filter((conv) => {
    const last = conv.messages?.[0];
    if (!last) return false;
    return last.senderId && last.senderId !== userId;
  }).length;

  const recommended = (jobs ?? []).slice(0, 2).map((job, idx) => ({
    type: "job" as const,
    title: job.title,
    company: "EnvoysJobs",
    match: idx === 0 ? "92%" : "86%",
    badge: "From An Envoy"
  }));

  const stats = [
    { label: "Applications Sent", value: String(applicationsCount), icon: Briefcase, change: "+0 this week" },
    { label: "Profile Views", value: "0", icon: Eye, change: "No data" },
    { label: "New Messages", value: String(unreadMessages), icon: MessageCircle, change: unreadMessages > 0 ? "Unread" : "All read" },
    { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp, change: "Based on hires" }
  ];

  return (
    <DashboardShell userName={name}>
      <DashboardOverview
        userName={name}
        stats={stats}
        recommendations={recommended.length ? recommended : undefined}
        onNavigate={(page) => {
          switch (page) {
            case "post-job":
              router.push("/hirer/jobs/new");
              break;
            case "offer-service":
              router.push("/envoy/services");
              break;
            case "post-gig":
              router.push("/envoy/gigs");
              break;
            default:
              router.push("/envoy/dashboard");
              break;
          }
        }}
      />
    </DashboardShell>
  );
}
