"use client";

import { useRouter } from "next/navigation";
import { Footer, Header, Homepage } from "@envoysjobs/ui";

export default function HomeClient() {
  const router = useRouter();

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
      case "services":
      case "gigs":
        router.push("/envoy/jobs");
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
      <Header onNavigate={handleNavigate} />
      <Homepage onNavigate={handleNavigate} />
      <Footer />
    </div>
  );
}