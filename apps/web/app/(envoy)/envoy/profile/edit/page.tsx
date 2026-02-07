"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const api = useApi();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["envoy-profile-edit"],
    queryFn: async () => {
      const res = await api<any>("/envoy/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const res = await api("/envoy/profile", {
      method: "PUT",
      body: JSON.stringify({
        bio: bio || data?.bio || "",
        location: location || data?.location || "",
        availability: data?.availability || "",
        portfolioLinks: data?.portfolioLinks || "",
        skills: skills || data?.skills || ""
      })
    });
    setSaving(false);
    if (res.error) {
      setSaveError("Failed to save profile.");
      return;
    }
    refetch();
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Edit Profile" description="Update your skills and bio.">
        {isLoading && <p className="text-foreground-secondary">Loading profile...</p>}
        {error && <p className="text-destructive">Failed to load profile.</p>}
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input
            className="input"
            placeholder="Location"
            defaultValue={data?.location || ""}
            onChange={(event) => setLocation(event.target.value)}
          />
          <textarea
            className="input min-h-[120px]"
            placeholder="Bio"
            defaultValue={data?.bio || ""}
            onChange={(event) => setBio(event.target.value)}
          />
          <input
            className="input"
            placeholder="Skills (comma separated)"
            defaultValue={data?.skills || ""}
            onChange={(event) => setSkills(event.target.value)}
          />
          {saveError && <p className="text-destructive">{saveError}</p>}
          <button className="cta" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
