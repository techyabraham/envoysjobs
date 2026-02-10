"use client";

import { useRouter } from "next/navigation";
import { Footer, Header, Homepage } from "@envoysjobs/ui";
import { useSession } from "next-auth/react";

export default function HomeClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const role = (session as any)?.user?.role as string | undefined;
  const name = (session as any)?.user?.name as string | undefined;

  const handleNavigate = (page: string) => {
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
      case "services":
        router.push("/services");
        break;
      case "gigs":
        router.push("/gigs");
        break;
      case "dashboard":
        router.push(role === "HIRER" ? "/hirer/dashboard" : "/envoy/dashboard");
        break;
      case "profile":
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
    <div className="min-h-screen bg-background">
      <Header
        onNavigate={handleNavigate}
        isAuthenticated={Boolean(session)}
        userName={name}
      />
      <Homepage onNavigate={handleNavigate} />
      <Footer />
    </div>
  );
}
