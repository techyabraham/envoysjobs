"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";

export default function Page() {
  const params = useParams();
  const userId = params?.id as string;
  const api = useApi();

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-envoy", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const res = await api<any>(`/envoy/profile?userId=${userId}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Envoy Profile" description="View envoy details.">
        {isLoading && <p className="text-foreground-secondary">Loading profile...</p>}
        {error && <p className="text-destructive">Failed to load profile.</p>}
        {data ? (
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-deep-blue text-white flex items-center justify-center text-lg font-semibold overflow-hidden">
                {data.user?.imageUrl ? (
                  <img
                    src={`${API_BASE_URL}${data.user.imageUrl}`}
                    alt={`${data.user?.firstName ?? "Envoy"} profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{data.user?.firstName?.[0] ?? "E"}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl">{data.user?.firstName} {data.user?.lastName}</h3>
                <p className="text-foreground-secondary">{data.bio || "Envoy"}</p>
              </div>
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
