"use client";

import { usePathname, useRouter } from "next/navigation";
import { DashboardLayout, type DashboardNavItem } from "@envoysjobs/ui";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Bell, Home, MessageCircle, User, Video } from "lucide-react";

const pageMap: Record<string, string> = {
  "/messages": "messages",
  "/envoy/dashboard": "dashboard",
  "/envoy/jobs": "jobs",
  "/envoy/services": "services",
  "/envoy/services/new": "services",
  "/envoy/gigs": "gigs",
  "/envoy/gigs/new": "gigs",
  "/envoy/webinars": "webinars",
  "/envoy/notifications": "notifications",
  "/envoy/messages": "messages",
  "/envoy/profile": "profile",
  "/envoy/skills": "profile",
  "/envoy/portfolio": "profile",
  "/envoy/availability": "profile",
  "/envoy/settings": "settings",
  "/envoy/history": "jobs",
  "/envoy/earnings": "dashboard",
  "/hirer/dashboard": "dashboard",
  "/hirer/jobs": "jobs",
  "/hirer/shortlist": "jobs",
  "/hirer/webinars": "webinars",
  "/hirer/notifications": "notifications",
  "/hirer/profile": "profile",
  "/hirer/settings": "settings",
  "/hirer/recruitment": "recruitment",
  "/hirer/become-recruiter": "become-recruiter"
};

export default function DashboardShell({
  children,
  userName
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const api = useApi();
  const role = (session as any)?.user?.role as string | undefined;
  const isHirerRoute = pathname.startsWith("/hirer");
  const hirerProfile = useQuery({
    queryKey: ["hirer-profile-nav"],
    queryFn: async () => {
      const res = await api<any>("/hirer/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    enabled: role === "HIRER" && isHirerRoute
  });
  const isRecruiter = Boolean(hirerProfile.data?.isRecruiter);
  const activePage = pathname.startsWith("/messages/") ? "messages" : pageMap[pathname] || "dashboard";

  const envoyNavigation: DashboardNavItem[] = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "jobs", name: "Jobs", icon: Briefcase },
    { id: "webinars", name: "Webinars", icon: Video },
    { id: "messages", name: "Messages", icon: MessageCircle },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "profile", name: "Profile", icon: User }
  ];

  const hirerNavigation: DashboardNavItem[] = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "jobs", name: "Jobs", icon: Briefcase },
    {
      id: isRecruiter ? "recruitment" : "become-recruiter",
      name: isRecruiter ? "Recruitment" : "Become a Recruiter",
      icon: Briefcase
    },
    { id: "webinars", name: "Webinars", icon: Video },
    { id: "messages", name: "Messages", icon: MessageCircle },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "profile", name: "Profile", icon: User }
  ];

  return (
    <DashboardLayout
      activePage={activePage}
      userName={userName}
      navigationItems={pathname.startsWith("/hirer") ? hirerNavigation : envoyNavigation}
      onNavigate={(page) => {
        if (page === "signout") {
          signOut({ callbackUrl: "/" });
          return;
        }
        if (page === "home") {
          router.push("/");
          return;
        }
        if (page === "messages") {
          router.push("/messages");
          return;
        }
        if (pathname.startsWith("/envoy")) {
          if (page === "dashboard") {
            router.push("/envoy/dashboard");
            return;
          }
          if (page === "webinars") {
            router.push("/envoy/webinars");
            return;
          }
          router.push(`/envoy/${page}`);
          return;
        }
        if (pathname.startsWith("/hirer")) {
          if (page === "dashboard") {
            router.push("/hirer/dashboard");
            return;
          }
          if (page === "recruitment") {
            router.push("/hirer/recruitment");
            return;
          }
          if (page === "become-recruiter") {
            router.push("/hirer/become-recruiter");
            return;
          }
          if (page === "services" || page === "gigs") {
            router.push("/hirer/dashboard");
            return;
          }
          if (page === "webinars") {
            router.push("/hirer/webinars");
            return;
          }
          router.push(`/hirer/${page}`);
          return;
        }
        if (pathname.startsWith("/messages")) {
          if (role === "ENVOY") {
            if (page === "dashboard") {
              router.push("/envoy/dashboard");
              return;
            }
            if (page === "webinars") {
              router.push("/envoy/webinars");
              return;
            }
            router.push(`/envoy/${page}`);
            return;
          }
          if (role === "HIRER") {
            if (page === "dashboard") {
              router.push("/hirer/dashboard");
              return;
            }
            if (page === "recruitment") {
              router.push("/hirer/recruitment");
              return;
            }
            if (page === "become-recruiter") {
              router.push("/hirer/become-recruiter");
              return;
            }
            if (page === "services" || page === "gigs") {
              router.push("/hirer/dashboard");
              return;
            }
            if (page === "webinars") {
              router.push("/hirer/webinars");
              return;
            }
            router.push(`/hirer/${page}`);
            return;
          }
        }
        router.push("/");
      }}
    >
      {children}
    </DashboardLayout>
  );
}
