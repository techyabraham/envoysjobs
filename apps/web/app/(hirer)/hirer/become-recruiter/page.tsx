"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Construction",
  "Real Estate",
  "Hospitality",
  "Transportation",
  "Media & Entertainment",
  "Non-Profit",
  "Other"
];

export default function Page() {
  const api = useApi();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [skillsInput, setSkillsInput] = useState("");

  const { isLoading, error } = useQuery({
    queryKey: ["hirer-profile-become-recruiter"],
    queryFn: async () => {
      const res = await api<any>("/hirer/profile");
      if (res.error) throw new Error(res.error);
      setSelectedIndustries(Array.isArray(res.data?.recruiterIndustries) ? res.data.recruiterIndustries : []);
      setSkillsInput(Array.isArray(res.data?.recruiterSkills) ? res.data.recruiterSkills.join(", ") : "");
      return res.data;
    }
  });

  const skills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [skillsInput]
  );

  const save = useMutation({
    mutationFn: async () => {
      const res = await api("/hirer/profile", {
        method: "PUT",
        body: JSON.stringify({
          isRecruiter: true,
          recruiterIndustries: selectedIndustries,
          recruiterSkills: skills
        })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["hirer-profile-nav"] });
      await queryClient.invalidateQueries({ queryKey: ["hirer-profile-recruitment"] });
      router.push("/hirer/recruitment");
    }
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((item) => item !== industry) : [...prev, industry]
    );
  };

  return (
    <DashboardShell userName="Hirer">
      <PageShell title="Become a Recruiter" description="Set what industries and skills you want to recruit from.">
        {isLoading && <p className="text-foreground-secondary">Loading profile...</p>}
        {error && <p className="text-destructive">Failed to load profile.</p>}

        <div className="bg-white border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Industries</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleIndustry(industry)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedIndustries.includes(industry)
                      ? "bg-deep-blue text-white"
                      : "border border-input-border bg-background-secondary text-foreground-secondary"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
            <input
              className="input"
              placeholder="e.g. Sales, Product Design, Frontend Development"
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
            />
          </div>

          {save.isError ? <p className="text-sm text-destructive">Failed to save recruitment profile.</p> : null}

          <button
            className="btn-primary"
            disabled={selectedIndustries.length === 0 || save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? "Saving..." : "Save Recruitment Profile"}
          </button>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
