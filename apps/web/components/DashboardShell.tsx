"use client";

import { usePathname, useRouter } from "next/navigation";
import { DashboardLayout } from "@envoysjobs/ui";

const pageMap: Record<string, string> = {
  "/envoy/dashboard": "dashboard",
  "/envoy/jobs": "jobs",
  "/envoy/services": "services",
  "/envoy/services/new": "services",
  "/envoy/gigs": "gigs",
  "/envoy/gigs/new": "gigs",
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
  "/hirer/notifications": "notifications",
  "/hirer/profile": "profile",
  "/hirer/settings": "settings"
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
  const activePage = pageMap[pathname] || "dashboard";

  return (
    <DashboardLayout
      activePage={activePage}
      userName={userName}
      onNavigate={(page) => {
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
          router.push(`/envoy/${page}`);
          return;
        }
        if (pathname.startsWith("/hirer")) {
          if (page === "dashboard") {
            router.push("/hirer/dashboard");
            return;
          }
          if (page === "services" || page === "gigs") {
            router.push("/hirer/dashboard");
            return;
          }
          router.push(`/hirer/${page}`);
          return;
        }
        router.push("/");
      }}
    >
      {children}
    </DashboardLayout>
  );
}
