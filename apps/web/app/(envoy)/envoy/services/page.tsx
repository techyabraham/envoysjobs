"use client";

import DashboardShell from "@/components/DashboardShell";
import { ServicesModule } from "@envoysjobs/ui";
import { useRouter } from "next/navigation";
import { useMyServices } from "@/lib/services";

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useMyServices();
  const service = data?.[0] ?? null;

  return (
    <DashboardShell userName="Grace">
      <ServicesModule
        onCreate={() => router.push("/envoy/services/new")}
        onEdit={() => service?.id && router.push(`/envoy/services/${service.id}/edit`)}
        service={service}
        stats={
          isLoading
            ? {
                rating: 0,
                reviewCount: 0,
                views: 0,
                enquiries: 0
              }
            : undefined
        }
      />
    </DashboardShell>
  );
}
