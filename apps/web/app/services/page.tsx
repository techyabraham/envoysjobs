"use client";

import PageShell from "@/components/PageShell";
import { ServiceCard } from "@envoysjobs/ui";
import { usePublicServices } from "@/lib/services";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data, isLoading, error } = usePublicServices();

  return (
    <PageShell title="Services Directory" description="Find trusted Envoys offering professional services.">
      {isLoading && <p className="text-foreground-secondary">Loading services...</p>}
      {error && <p className="text-destructive">Failed to load services.</p>}
      {!isLoading && data?.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">No services available yet.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((service) => (
          <ServiceCard
            key={service.id}
            name={service.envoy ? `${service.envoy.firstName} ${service.envoy.lastName}` : "Envoy"}
            photo={service.imageUrl ? `${API_BASE_URL}${service.imageUrl}` : null}
            skill={service.title}
            tags={service.description.split(" ").slice(0, 3)}
            rating={4.8}
            reviewCount={12}
            onAction={() => router.push(`/services/${service.id}`)}
          />
        ))}
      </div>
    </PageShell>
  );
}
