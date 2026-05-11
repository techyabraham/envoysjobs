"use client";

import { useRouter } from "next/navigation";
import { Footer, Homepage } from "@envoysjobs/ui";
import { useSession } from "next-auth/react";
import { useJobs } from "@/lib/jobs";
import { usePublicServices } from "@/lib/services";
import { useAvailableGigs } from "@/lib/gigs";
import { resolveAssetUrl } from "@/lib/api";

export default function HomeClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const jobs = useJobs();
  const services = usePublicServices();
  const gigs = useAvailableGigs();
  const role = (session as any)?.user?.role as string | undefined;
  const featuredJobs =
    jobs.data?.slice(0, 4).map((job) => ({
      id: job.id,
      title: job.title,
      company: "EnvoysJobs",
      location: job.location ?? "Nigeria",
      pay: job.salaryMin && job.salaryMax ? `NGN ${job.salaryMin} - ${job.salaryMax}` : "Negotiable",
      type: job.locationType,
      postedTime: "Recently",
      fromMember: true
    })) ?? [];
  const featuredServices =
    services.data?.slice(0, 4).map((service) => ({
      id: service.id,
      name: service.envoy ? `${service.envoy.firstName} ${service.envoy.lastName}` : "Envoy",
      photo: resolveAssetUrl(service.imageUrl),
      skill: service.title,
      tags: service.description.split(" ").slice(0, 3),
      rating: 4.8,
      reviewCount: 12
    })) ?? [];
  const featuredGigs =
    gigs.data?.slice(0, 4).map((gig) => ({
      id: gig.id,
      title: gig.title,
      amount: gig.amount,
      location: gig.location,
      duration: gig.duration,
      urgent: gig.urgent,
      postedBy: gig.postedBy ? `${gig.postedBy.firstName} ${gig.postedBy.lastName}` : "Hirer"
    })) ?? [];

  const jobsShared = jobs.data ? jobs.data.length.toLocaleString() : "—";
  const servicesListed = services.data ? services.data.length.toLocaleString() : "—";

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
      case "post-job":
        if (!session) {
          router.push("/auth/login");
          break;
        }
        if (role === "HIRER") {
          router.push("/hirer/jobs/new");
          break;
        }
        router.push("/hirer/dashboard");
        break;
      case "jobs-search":
        router.push(`/jobs?q=${encodeURIComponent(id || "")}&type=jobs`);
        break;
      case "job":
        if (id) router.push(`/jobs/${id}`);
        break;
      case "services":
        router.push("/services");
        break;
      case "post-service":
        if (!session) {
          router.push("/auth/login");
          break;
        }
        if (role === "HIRER") {
          router.push("/hirer/dashboard");
          break;
        }
        router.push("/envoy/services/new");
        break;
      case "services-search":
        router.push(`/services?q=${encodeURIComponent(id || "")}&type=services`);
        break;
      case "service":
        if (id) router.push(`/services/${id}`);
        break;
      case "gigs":
        router.push("/gigs");
        break;
      case "post-gig":
        if (!session) {
          router.push("/auth/login");
          break;
        }
        if (role === "HIRER") {
          router.push("/hirer/dashboard");
          break;
        }
        router.push("/envoy/gigs/new");
        break;
      case "gigs-search":
        router.push(`/gigs?q=${encodeURIComponent(id || "")}&type=gigs`);
        break;
      case "gig":
        if (id) router.push(`/gigs/${id}`);
        break;
      case "webinars":
        if (!session) {
          router.push("/auth/login");
          break;
        }
        router.push(role === "HIRER" ? "/hirer/webinars" : "/envoy/webinars");
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
      <Homepage
        onNavigate={handleNavigate}
        isAuthenticated={Boolean(session)}
        onSearch={(filter, query) => {
          if (filter === "services") {
            router.push(`/services?q=${encodeURIComponent(query)}&type=services`);
            return;
          }
          if (filter === "gigs") {
            router.push(`/gigs?q=${encodeURIComponent(query)}&type=gigs`);
            return;
          }
          const type = filter === "all" ? "all" : "jobs";
          router.push(`/jobs?q=${encodeURIComponent(query)}&type=${type}`);
        }}
        jobsShared={jobsShared}
        servicesListed={servicesListed}
        webinars={[
          {
            title: "Building Excellence in Service Delivery",
            embedUrl: "https://www.youtube.com/embed/R0Pq-mXu9kA"
          },
          {
            title: "Economic Community and Growth",
            embedUrl: "https://www.youtube.com/embed/LMhkLnHNwRA"
          }
        ]}
        featuredJobs={featuredJobs}
        featuredServices={featuredServices}
        featuredGigs={featuredGigs}
      />
      <Footer />
    </div>
  );
}
