"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const api = useApi();
  const { data, isLoading, error } = useQuery({
    queryKey: ["envoy-profile"],
    queryFn: async () => {
      const res = await api<any>("/envoy/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  return (
    <DashboardShell userName="Grace">
      <PageShell title="My Profile" description="Your public profile for hirers.">
        {isLoading && <p className="text-foreground-secondary">Loading profile...</p>}
        {error && <p className="text-destructive">Failed to load profile.</p>}
        {data ? (
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl">{data.user?.firstName} {data.user?.lastName}</h3>
                <p className="text-foreground-secondary">{data.bio || "Envoy"}</p>
              </div>
              {data.user?.stewardStatus && (
                <span className="px-3 py-1 text-sm rounded-full bg-soft-gold/20 text-soft-gold-dark">
                  Steward ({data.user?.stewardStatus === "VERIFIED" ? "Verified" : "Pending Verification"})
                </span>
              )}
            </div>
            <p className="text-foreground-secondary">{data.location || "Location not set"}</p>
            {data.skills && (
              <div className="flex gap-2 flex-wrap">
                {data.skills.split(",").map((skill: string) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-background-secondary text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
