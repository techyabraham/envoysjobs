"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const api = useApi();
  const { data, isLoading, error } = useQuery({
    queryKey: ["hirer-profile"],
    queryFn: async () => {
      const res = await api<any>("/hirer/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="My Profile" description="Your hirer profile.">
        {isLoading && <p className="text-foreground-secondary">Loading profile...</p>}
        {error && <p className="text-destructive">Failed to load profile.</p>}
        {data ? (
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xl">{data.user?.firstName} {data.user?.lastName}</h3>
              <p className="text-foreground-secondary">{data.type}</p>
            </div>
            {data.businessName && <p className="text-foreground-secondary">{data.businessName}</p>}
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
