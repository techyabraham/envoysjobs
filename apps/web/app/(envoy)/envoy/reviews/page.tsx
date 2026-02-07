"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const api = useApi();
  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await api<any[]>("/reviews");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Reviews" description="Your feedback and ratings.">
        {isLoading && <p className="text-foreground-secondary">Loading reviews...</p>}
        {error && <p className="text-destructive">Failed to load reviews.</p>}
        {!isLoading && data?.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-foreground-secondary">No reviews yet.</p>
          </div>
        )}
        <div className="grid gap-4">
          {data?.map((review) => (
            <div key={review.id} className="bg-white border border-border rounded-2xl p-5">
              <p className="text-sm text-foreground-tertiary">Rating: {review.rating}/5</p>
              {review.text && <p className="text-foreground-secondary mt-2">{review.text}</p>}
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
