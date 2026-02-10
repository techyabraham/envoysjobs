"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const api = useApi();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["envoy-portfolio"],
    queryFn: async () => {
      const res = await api<any>("/envoy/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const [portfolio, setPortfolio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.portfolioLinks) {
      setPortfolio(String(data.portfolioLinks));
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    const res = await api("/envoy/profile", {
      method: "PUT",
      body: JSON.stringify({
        portfolioLinks: portfolio
      })
    });
    setSaving(false);
    if (res.error) {
      alert("Failed to update portfolio.");
      return;
    }
    refetch();
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Portfolio" description="Share links to your best work.">
        {isLoading && <p className="text-foreground-secondary">Loading portfolio...</p>}
        {error && <p className="text-destructive">Failed to load portfolio.</p>}

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <textarea
            className="input min-h-[140px]"
            placeholder="Add portfolio links, one per line"
            value={portfolio}
            onChange={(event) => setPortfolio(event.target.value)}
          />
          <button className="cta" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Portfolio"}
          </button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
