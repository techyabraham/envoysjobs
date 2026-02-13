"use client";

import DashboardShell from "@/components/DashboardShell";
import { GigsModule } from "@envoysjobs/ui";
import { useRouter } from "next/navigation";
import { useApplyToGig, useAvailableGigs, useAppliedGigs, useMyGigs } from "@/lib/gigs";

export default function Page() {
  const router = useRouter();
  const { data: available } = useAvailableGigs();
  const { data: mine } = useMyGigs();
  const { data: applied } = useAppliedGigs();
  const applyToGig = useApplyToGig();

  const appliedIds = new Set((applied ?? []).map((application) => application.gig.id));

  const availableGigs = (available ?? [])
    .filter((gig) => !appliedIds.has(gig.id))
    .map((gig) => ({
    id: gig.id,
    title: gig.title,
    amount: gig.amount,
    location: gig.location,
    duration: gig.duration,
    postedBy: gig.postedBy ? `${gig.postedBy.firstName} ${gig.postedBy.lastName}` : "Envoy",
    urgent: gig.urgent,
    status: "available" as const
  }));

  const postedGigs = (mine ?? []).map((gig) => ({
    id: gig.id,
    title: gig.title,
    amount: gig.amount,
    location: gig.location,
    duration: gig.duration,
    postedBy: "You",
    urgent: gig.urgent,
    status: "available" as const
  }));

  const appliedGigs = (applied ?? []).map((application) => ({
    id: application.gig.id,
    title: application.gig.title,
    amount: application.gig.amount,
    location: application.gig.location,
    duration: application.gig.duration,
    postedBy: application.gig.postedBy ? `${application.gig.postedBy.firstName} ${application.gig.postedBy.lastName}` : "Envoy",
    urgent: application.gig.urgent,
    status: "applied" as const,
    applicationDate: new Date(application.createdAt).toLocaleDateString()
  }));

  return (
    <DashboardShell userName="Grace">
      <GigsModule
        onCreate={() => router.push("/envoy/gigs/new")}
        availableGigs={availableGigs}
        postedGigs={postedGigs}
        appliedGigs={appliedGigs}
        onApply={(gigId) => applyToGig.mutate({ gigId })}
      />
    </DashboardShell>
  );
}
