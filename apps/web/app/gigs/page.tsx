"use client";

import PageShell from "@/components/PageShell";
import { GigCard } from "@envoysjobs/ui";
import { useAvailableGigs } from "@/lib/gigs";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const { data, isLoading, error } = useAvailableGigs();
  const filtered = useMemo(() => {
    if (!query) return data;
    return (data ?? []).filter((gig) => {
      const haystack = [gig.title, gig.location, gig.duration, gig.amount]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [data, query]);

  return (
    <PageShell title="Gigs" description="Quick opportunities for immediate work.">
      {isLoading && <p className="text-foreground-secondary">Loading gigs...</p>}
      {error && <p className="text-destructive">Failed to load gigs.</p>}
      {!isLoading && filtered?.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">No gigs available yet.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered?.map((gig) => (
          <GigCard
            key={gig.id}
            title={gig.title}
            amount={gig.amount}
            location={gig.location}
            duration={gig.duration}
            urgent={gig.urgent}
            postedBy={gig.postedBy ? `${gig.postedBy.firstName} ${gig.postedBy.lastName}` : "Envoy"}
            onAction={() => router.push(`/gigs/${gig.id}`)}
          />
        ))}
      </div>
    </PageShell>
  );
}
