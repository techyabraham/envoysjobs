"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const api = useApi();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["envoy-skills"],
    queryFn: async () => {
      const res = await api<any>("/envoy/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const initialSkills = useMemo(() => {
    if (!data?.skills) return [] as string[];
    return String(data.skills).split(",").map((item: string) => item.trim()).filter(Boolean);
  }, [data]);

  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const effectiveSkills = skills.length ? skills : initialSkills;

  const addSkill = () => {
    const value = input.trim();
    if (!value) return;
    if (effectiveSkills.includes(value)) {
      setInput("");
      return;
    }
    setSkills([...effectiveSkills, value]);
    setInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills(effectiveSkills.filter((item) => item !== skill));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await api("/envoy/profile", {
      method: "PUT",
      body: JSON.stringify({
        skills: effectiveSkills.join(", ")
      })
    });
    setSaving(false);
    if (res.error) {
      alert("Failed to update skills.");
      return;
    }
    refetch();
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Skills" description="Manage the skills shown on your profile.">
        {isLoading && <p className="text-foreground-secondary">Loading skills...</p>}
        {error && <p className="text-destructive">Failed to load skills.</p>}

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 input"
              placeholder="Add a skill"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="cta" onClick={addSkill}>
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {effectiveSkills.length === 0 && (
              <p className="text-foreground-secondary">No skills added yet.</p>
            )}
            {effectiveSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => removeSkill(skill)}
                className="px-3 py-1 rounded-full bg-background-secondary text-sm"
              >
                {skill}
              </button>
            ))}
          </div>

          <button className="cta" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Skills"}
          </button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
