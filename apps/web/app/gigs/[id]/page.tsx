"use client";

import PageShell from "@/components/PageShell";
import { useGig, useApplyToGig } from "@/lib/gigs";
import { useParams, useRouter } from "next/navigation";
import { buildWhatsappUrl, CONTACT_LABELS, type ContactMethod } from "@/lib/contact";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data, isLoading, error } = useGig(id);
  const apply = useApplyToGig();
  const [counterBudget, setCounterBudget] = useState("");
  const methods = data?.contactMethods?.length ? data.contactMethods : (["PLATFORM"] as ContactMethod[]);

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
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-foreground-secondary">{data.description}</p>
          </div>
          <div className="bg-background-secondary border border-border rounded-2xl p-4 space-y-2">
            <label className="text-sm font-medium">Counter budget (optional)</label>
            <input
              className="input"
              placeholder="e.g. ₦25,000"
              value={counterBudget}
              onChange={(event) => setCounterBudget(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {methods.map((method) => {
              if (method === "WHATSAPP") {
                const url = buildWhatsappUrl(data.contactWhatsapp);
                if (!url) return null;
                return (
                  <button key={method} className="cta" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
                    {CONTACT_LABELS[method]}
                  </button>
                );
              }
              if (method === "EMAIL" && data.contactEmail) {
                return (
                  <button key={method} className="cta" onClick={() => window.location.href = `mailto:${data.contactEmail}`}>
                    {CONTACT_LABELS[method]}
                  </button>
                );
              }
              if (method === "WEBSITE" && data.contactWebsite) {
                return (
                  <button key={method} className="cta" onClick={() => window.open(data.contactWebsite!, "_blank", "noopener,noreferrer")}>
                    {CONTACT_LABELS[method]}
                  </button>
                );
              }
              if (method === "PLATFORM") {
                return (
                  <button
                    key={method}
                    className="cta"
                    onClick={async () => {
                      if (!id) return;
                      try {
                        await apply.mutateAsync({
                          gigId: id,
                          counterBudget: counterBudget.trim() || undefined
                        });
                        alert("Applied to gig.");
                      } catch {
                        alert("Failed to apply. Please sign in.");
                      }
                    }}
                    disabled={apply.isPending}
                  >
                    {apply.isPending ? "Applying..." : "Apply on EnvoysJobs"}
                  </button>
                );
              }
              return null;
            })}
            <button className="btn-secondary" onClick={() => router.push("/gigs")}>Back to Gigs</button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
