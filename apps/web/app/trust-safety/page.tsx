"use client";

import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useState } from "react";

export default function Page() {
  const api = useApi();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const res = await api("/reports", {
      method: "POST",
      body: JSON.stringify({ reason })
    });
    setLoading(false);
    if (res.error) {
      setStatus("Failed to submit report.");
      return;
    }
    setReason("");
    setStatus("Report submitted.");
  };

  return (
    <PageShell title="Trust & Safety" description="Community guidelines and reporting.">
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <p>
          EnvoysJobs is built on honour, transparency, and community safety. If you encounter an issue, please submit a report.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="input min-h-[120px]"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Describe the issue..."
            required
          />
          {status && <p className="text-foreground-secondary">{status}</p>}
          <button className="cta" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
