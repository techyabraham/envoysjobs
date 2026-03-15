"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {
  const api = useApi();
  const { data, isLoading, error } = useQuery({
    queryKey: ["hirer-profile-recruitment"],
    queryFn: async () => {
      const res = await api<any>("/hirer/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  return (
    <DashboardShell userName="Hirer">
      <PageShell title="Recruitment" description="Manage your recruiter focus areas and candidate sourcing.">
        {isLoading && <p className="text-foreground-secondary">Loading recruitment profile...</p>}
        {error && <p className="text-destructive">Failed to load recruitment profile.</p>}

        {data && !data.isRecruiter ? (
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <p className="text-foreground-secondary">Your account is not enabled for recruitment yet.</p>
            <Link href="/hirer/become-recruiter" className="btn-secondary inline-flex">
              Become a Recruiter
            </Link>
          </div>
        ) : null}

        {data?.isRecruiter ? (
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Industries</h3>
              <div className="flex flex-wrap gap-2">
                {(data.recruiterIndustries ?? []).map((industry: string) => (
                  <span key={industry} className="px-3 py-1 rounded-full bg-background-secondary text-sm">
                    {industry}
                  </span>
                ))}
                {(data.recruiterIndustries ?? []).length === 0 ? (
                  <span className="text-foreground-tertiary text-sm">No industries selected yet.</span>
                ) : null}
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Skills Focus</h3>
              <div className="flex flex-wrap gap-2">
                {(data.recruiterSkills ?? []).map((skill: string) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-background-secondary text-sm">
                    {skill}
                  </span>
                ))}
                {(data.recruiterSkills ?? []).length === 0 ? (
                  <span className="text-foreground-tertiary text-sm">No skills selected yet.</span>
                ) : null}
              </div>
            </div>

            <div>
              <Link href="/hirer/become-recruiter" className="btn-secondary inline-flex">
                Edit Recruitment Preferences
              </Link>
            </div>
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
