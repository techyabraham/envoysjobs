"use client";

import { useRouter } from "next/navigation";
import { Footer, Homepage } from "@envoysjobs/ui";
import { useSession } from "next-auth/react";
import { useJobs } from "@/lib/jobs";
import { usePublicServices } from "@/lib/services";
import { useAvailableGigs } from "@/lib/gigs";
import { API_BASE_URL } from "@/lib/api";

export default function HomeClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const jobs = useJobs();
  const services = usePublicServices();
  const gigs = useAvailableGigs();
  const role = (session as any)?.user?.role as string | undefined;

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
        featuredJobs={jobs.data?.slice(0, 4).map((job) => ({
          id: job.id,
          title: job.title,
          company: "EnvoysJobs",
          location: job.location ?? "Nigeria",
          pay: job.salaryMin && job.salaryMax ? `NGN ${job.salaryMin} - ${job.salaryMax}` : "Negotiable",
          type: job.locationType,
          postedTime: "Recently",
          fromMember: true
        }))}
        featuredServices={services.data?.slice(0, 4).map((service) => ({
          id: service.id,
          name: service.envoy ? `${service.envoy.firstName} ${service.envoy.lastName}` : "Envoy",
          photo: service.imageUrl ? `${API_BASE_URL}${service.imageUrl}` : null,
          skill: service.title,
          tags: service.description.split(" ").slice(0, 3),
          rating: 4.8,
          reviewCount: 12
        }))}
        featuredGigs={gigs.data?.slice(0, 4).map((gig) => ({
          id: gig.id,
          title: gig.title,
          amount: gig.amount,
          location: gig.location,
          duration: gig.duration,
          urgent: gig.urgent,
          postedBy: gig.postedBy ? `${gig.postedBy.firstName} ${gig.postedBy.lastName}` : "Hirer"
        }))}
      />
      <Footer />
    </div>
  );
}
