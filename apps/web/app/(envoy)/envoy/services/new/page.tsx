"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateService } from "@/lib/services";

export default function Page() {
  const router = useRouter();
  const createService = useCreateService();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createService.mutateAsync({ title, description, rate });
      router.push("/envoy/services");
    } catch (err: any) {
      setError(err?.message || "Unable to save service");
    }
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Create Service" description="List a service for other Envoys to discover.">
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input
            className="input"
            placeholder="Service title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            className="input min-h-[140px]"
            placeholder="Describe your service"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Rate or range (e.g. ₦20,000 - ₦60,000)"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button className="cta" type="submit" disabled={createService.isPending}>
              {createService.isPending ? "Saving..." : "Save Service"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.push("/envoy/services")}
              disabled={createService.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
