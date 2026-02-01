"use client";

import { usePathname, useRouter } from "next/navigation";
import { DashboardLayout } from "@envoysjobs/ui";

const pageMap: Record<string, string> = {
  "/envoy/dashboard": "dashboard",
  "/envoy/jobs": "jobs",
  "/envoy/messages": "messages",
  "/envoy/profile": "profile",
  "/hirer/dashboard": "dashboard",
  "/hirer/jobs": "jobs",
  "/hirer/messages": "messages",
  "/hirer/profile": "profile"
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
        if (pathname.startsWith("/envoy")) {
          const route = page === "dashboard" ? "/envoy/dashboard" : `/envoy/${page}`;
          router.push(route);
          return;
        }
        if (pathname.startsWith("/hirer")) {
          const route = page === "dashboard" ? "/hirer/dashboard" : `/hirer/${page}`;
          router.push(route);
          return;
        }
        router.push("/");
      }}
    >
      {children}
    </DashboardLayout>
  );
}
