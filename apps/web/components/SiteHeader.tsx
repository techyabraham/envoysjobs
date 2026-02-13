"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@envoysjobs/ui";

export default function SiteHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const role = (session as any)?.user?.role as string | undefined;
  const name = (session as any)?.user?.name as string | undefined;

  const handleNavigate = (page: string, id?: string) => {
    switch (page) {
      case "home":
        router.push("/");
        break;
      case "login":
        router.push("/auth/login");
        break;
      case "signup":
        router.push("/auth/signup");
        break;
      case "jobs":
        router.push("/jobs");
        break;
      case "job":
        if (id) router.push(`/jobs/${id}`);
        break;
      case "services":
        router.push("/services");
        break;
      case "service":
        if (id) router.push(`/services/${id}`);
        break;
      case "gigs":
        router.push("/gigs");
        break;
      case "gig":
        if (id) router.push(`/gigs/${id}`);
        break;
      case "dashboard":
        if (role === "ADMIN") {
          router.push("/admin");
          break;
        }
        router.push(role === "HIRER" ? "/hirer/dashboard" : "/envoy/dashboard");
        break;
      case "profile":
        if (role === "ADMIN") {
          router.push("/admin");
          break;
        }
        router.push(role === "HIRER" ? "/hirer/profile" : "/envoy/profile");
        break;
      case "about":
        router.push("/trust-safety");
        break;
      default:
        router.push("/");
        break;
    }
  };

  return (
    <Header
      onNavigate={handleNavigate}
      isAuthenticated={Boolean(session)}
      userName={name}
    />
  );
}
