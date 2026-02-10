"use client";

import PageShell from "@/components/PageShell";
import { GigCard } from "@envoysjobs/ui";
import { useAvailableGigs } from "@/lib/gigs";

export default function Page() {
  const { data, isLoading, error } = useAvailableGigs();

  return (
    <PageShell title="Gigs" description="Quick opportunities for immediate work.">
      {isLoading && <p className="text-foreground-secondary">Loading gigs...</p>}
      {error && <p className="text-destructive">Failed to load gigs.</p>}
      {!isLoading && data?.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">No gigs available yet.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((gig) => (
          <GigCard
            key={gig.id}
            title={gig.title}
            amount={gig.amount}
            location={gig.location}
            duration={gig.duration}
            urgent={gig.urgent}
            postedBy={gig.postedBy ? `${gig.postedBy.firstName} ${gig.postedBy.lastName}` : "Envoy"}
          />
        ))}
      </div>
    </PageShell>
  );
}
