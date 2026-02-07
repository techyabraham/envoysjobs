"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    const res = await api(`/jobs/${jobId}/close`, { method: "POST" });
    setLoading(false);
    if (res.error) {
      setError("Failed to close job.");
      return;
    }
    router.push(`/hirer/jobs/${jobId}/review`);
  };

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Complete Job" description="Mark this job as completed.">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <p className="text-foreground-secondary">When the job is complete, close it to proceed to review.</p>
          {error && <p className="text-destructive">{error}</p>}
          <button className="cta" onClick={handleClose} disabled={loading}>
            {loading ? "Closing..." : "Close Job"}
          </button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
