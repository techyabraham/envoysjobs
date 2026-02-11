"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateGig } from "@/lib/gigs";
import { useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const createGig = useCreateGig();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (status === "loading") {
      setError("Please wait, loading session...");
      return;
    }
    const role = (session as any)?.user?.role as string | undefined;
    if (!session) {
      setError("Please sign in to post a gig.");
      router.push("/auth/login");
      return;
    }
    if (role !== "ENVOY") {
      setError("Envoy account required to post gigs.");
      return;
    }
    try {
      await createGig.mutateAsync({ title, amount, location, duration, urgent });
      router.push("/envoy/gigs");
    } catch (err: any) {
      setError(err?.message || "Unable to post gig");
    }
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Post a Gig" description="Share a short-term opportunity with Envoys.">
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input
            className="input"
            placeholder="Gig title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Amount (e.g. NGN 15,000)"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Duration (e.g. 2 days)"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-sm text-foreground-secondary">
            <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
            Mark as urgent
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button className="cta" type="submit" disabled={createGig.isPending}>
              {createGig.isPending ? "Saving..." : "Post Gig"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.push("/envoy/gigs")}
              disabled={createGig.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
