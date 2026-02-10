"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";

const options = ["full-time", "part-time", "freelance", "contract", "available"];

export default function Page() {
  const api = useApi();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["envoy-availability"],
    queryFn: async () => {
      const res = await api<any>("/envoy/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const [availability, setAvailability] = useState("available");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.availability) {
      setAvailability(String(data.availability));
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    const res = await api("/envoy/profile", {
      method: "PUT",
      body: JSON.stringify({ availability })
    });
    setSaving(false);
    if (res.error) {
      alert("Failed to update availability.");
      return;
    }
    refetch();
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Availability" description="Let hirers know when you're available.">
        {isLoading && <p className="text-foreground-secondary">Loading availability...</p>}
        {error && <p className="text-destructive">Failed to load availability.</p>}

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setAvailability(option)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  availability === option
                    ? "bg-emerald-green text-white border-emerald-green"
                    : "bg-background-secondary border-border"
                }`}
              >
                {option.replace("-", " ")}
              </button>
            ))}
          </div>
          <button className="cta" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
