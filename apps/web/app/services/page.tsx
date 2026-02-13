"use client";

import PageShell from "@/components/PageShell";
import { ServiceCard } from "@envoysjobs/ui";
import { useMyServicesAny, usePublicServices } from "@/lib/services";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const { data, isLoading, error } = usePublicServices(query);
  const mine = useMyServicesAny(Boolean(session));
  const myServices = session ? mine.data ?? [] : [];

  return (
    <PageShell title="Services Directory" description="Find trusted Envoys offering professional services.">
      <div className="bg-white border border-border rounded-2xl p-4 mb-5">
        <input
          className="input"
          placeholder="Search services by title, provider, rate, or keyword"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {session && myServices.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">My Services</h2>
            <button className="btn-secondary" onClick={() => router.push("/envoy/services")}>
              Manage
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myServices.slice(0, 4).map((service) => (
              <ServiceCard
                key={`mine-${service.id}`}
                name="You"
                photo={service.imageUrl ? `${API_BASE_URL}${service.imageUrl}` : null}
                skill={service.title}
                tags={service.description.split(" ").slice(0, 3)}
                rating={4.8}
                reviewCount={12}
                onAction={() => router.push(`/services/${service.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {isLoading && <p className="text-foreground-secondary">Loading services...</p>}
      {error && (
        <p className="text-destructive">
          Failed to load services. {(error as Error).message || "Please try again."}
        </p>
      )}
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
