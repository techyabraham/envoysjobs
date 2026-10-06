"use client";

import DashboardShell from "@/components/DashboardShell";
import { DashboardOverview } from "@envoysjobs/ui";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useJobs } from "@/lib/jobs";
import { useApplications } from "@/lib/applications";
import { useConversations } from "@/lib/messaging";
import { useMyServices } from "@/lib/services";
import { useMyGigs } from "@/lib/gigs";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ClipboardList, MessageCircle, Wrench } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();
  const name = (session as any)?.user?.name || "Envoy";
  const userId = (session as any)?.user?.id as string | undefined;
  const router = useRouter();
  const api = useApi();
  const { data: jobs, error: jobsError } = useJobs();
  const { data: applications, error: applicationsError } = useApplications();
  const { data: conversations, error: conversationsError } = useConversations(userId);
  const { data: services, error: servicesError } = useMyServices();
  const { data: gigs, error: gigsError } = useMyGigs();
  const profile = useQuery({
    queryKey: ["envoy-profile-dashboard"],
    enabled: Boolean(userId),
    queryFn: async () => {
      const res = await api<any>("/envoy/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const unreadMessages = (conversations ?? []).filter((conv) => {
    const last = conv.messages?.[0];
    if (!last) return false;
    return last.senderId && last.senderId !== userId;
  }).length;

  const recommended = (jobs ?? []).slice(0, 3).map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company || "Shared by a community member",
    location: job.location
  }));

  const stats = [
    { label: "Job applications", value: String(applications?.length ?? 0), icon: Briefcase },
    { label: "Services listed", value: String(services?.length ?? 0), icon: Wrench },
    { label: "Gigs shared", value: String(gigs?.length ?? 0), icon: ClipboardList },
    { label: "Unread conversations", value: String(unreadMessages), icon: MessageCircle }
  ];

  const queryErrors = [jobsError, applicationsError, conversationsError, servicesError, gigsError, profile.error].filter(Boolean) as Error[];

  return (
    <DashboardShell userName={name}>
      <>
        {queryErrors.map((error, index) => <p key={index} role="alert" className="mx-4 mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error.message}</p>)}
        <DashboardOverview
          userName={name}
          stats={stats}
          memberGoals={profile.data?.memberGoals ?? []}
          profileNeedsDetails={!profile.isLoading && !profile.error && (!profile.data?.bio?.trim() || !profile.data?.portfolioLinks?.trim())}
          recommendations={recommended}
          onNavigate={(page) => {
          switch (page) {
            case "find-work":
              router.push("/envoy/jobs");
              break;
            case "offer-service":
              router.push("/envoy/services/new");
              break;
            case "find-gigs":
              router.push("/envoy/gigs");
              break;
            case "deals":
              router.push("/deals");
              break;
            case "edit-profile":
              router.push("/envoy/profile/edit");
              break;
            default:
              if (page.startsWith("job:")) router.push(`/envoy/jobs/${page.slice(4)}`);
              else router.push("/envoy/dashboard");
              break;
          }
        }}
      />
      </>
    </DashboardShell>
  );
}
