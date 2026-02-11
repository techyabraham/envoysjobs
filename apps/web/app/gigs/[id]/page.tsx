"use client";

import PageShell from "@/components/PageShell";
import { useGig, useApplyToGig } from "@/lib/gigs";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data, isLoading, error } = useGig(id);
  const apply = useApplyToGig();

  return (
    <PageShell title="Gig" description="Gig details and application.">
      {isLoading && <p className="text-foreground-secondary">Loading gig...</p>}
      {error && <p className="text-destructive">Failed to load gig.</p>}
      {data ? (
        <div className="bg-white border border-border rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">{data.title}</h2>
            <p className="text-foreground-secondary">{data.amount}</p>
            {data.postedBy && (
              <p className="text-sm text-foreground-tertiary">
                Posted by {data.postedBy.firstName} {data.postedBy.lastName}
              </p>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-foreground-secondary">
            <div>Location: {data.location}</div>
            <div>Duration: {data.duration}</div>
            <div>Status: {data.status}</div>
            <div>Urgent: {data.urgent ? "Yes" : "No"}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="cta"
              onClick={async () => {
                if (!id) return;
                try {
                  await apply.mutateAsync(id);
                  alert("Applied to gig.");
                } catch (e) {
                  alert("Failed to apply. Please sign in.");
                }
              }}
              disabled={apply.isPending}
            >
              {apply.isPending ? "Applying..." : "Apply for Gig"}
            </button>
            <button className="btn-secondary" onClick={() => router.push("/gigs")}>Back to Gigs</button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
