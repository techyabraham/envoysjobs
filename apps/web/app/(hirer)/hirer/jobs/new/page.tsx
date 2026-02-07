"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const api = useApi();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState<"ONSITE" | "REMOTE" | "HYBRID">("REMOTE");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description,
      locationType,
      location: location || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      status: "DRAFT"
    };

    const res = await api("/jobs", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    setLoading(false);
    if (res.error) {
      setError("Failed to create job.");
      return;
    }

    router.push("/hirer/jobs");
  };

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Post a new job" description="Share a trusted opportunity with Envoys.">
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input
            className="input"
            placeholder="Job title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            className="input min-h-[120px]"
            placeholder="Job description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="input"
              value={locationType}
              onChange={(event) => setLocationType(event.target.value as any)}
            >
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
            </select>
            <input
              className="input"
              placeholder="Location (optional)"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Salary min"
              value={salaryMin}
              onChange={(event) => setSalaryMin(event.target.value)}
            />
            <input
              className="input"
              placeholder="Salary max"
              value={salaryMax}
              onChange={(event) => setSalaryMax(event.target.value)}
            />
          </div>
          {error && <p className="text-destructive">{error}</p>}
          <button className="cta" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish"}
          </button>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
