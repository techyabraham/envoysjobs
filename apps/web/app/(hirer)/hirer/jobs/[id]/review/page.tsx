"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApplications } from "@/lib/applications";
import { useApi } from "@/lib/useApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const api = useApi();
  const jobId = params?.id as string;
  const { data: applications } = useApplications();
  const hired = applications?.find((app) => app.jobId === jobId && app.status === "HIRED");
  const [rating, setRating] = useState("5");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!hired?.envoyId) {
      setError("No hired envoy found for this job.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await api("/reviews", {
      method: "POST",
      body: JSON.stringify({
        jobId,
        revieweeId: hired.envoyId,
        rating: Number(rating),
        text: text || undefined
      })
    });
    setLoading(false);
    if (res.error) {
      setError("Failed to submit review.");
      return;
    }
    router.push("/hirer/jobs");
  };

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Leave a Review" description="Share your feedback on the envoy.">
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Rating (1-5)</label>
            <input
              className="input"
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Comment</label>
            <textarea
              className="input min-h-[120px]"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Share how it went..."
            />
          </div>
          {error && <p className="text-destructive">{error}</p>}
          <button className="cta" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
