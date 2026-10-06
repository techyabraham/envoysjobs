"use client";

import PageShell from "@/components/PageShell";
import ProviderServicesCard, { type ProviderOffering } from "@/components/services/ProviderServicesCard";
import { useMyServicesAny, usePublicServices, type Service } from "@/lib/services";
import { resolveAssetUrl } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type ProviderGroup = { id: string; name: string; avatarUrl?: string | null; services: ProviderOffering[] };

function groupServices(services: Service[], fallbackName = "Member") {
  const groups = new Map<string, ProviderGroup>();
  for (const service of services) {
    const providerId = service.envoy?.id ?? service.envoyId ?? service.id;
    const group = groups.get(providerId) ?? {
      id: providerId,
      name: service.envoy ? `${service.envoy.firstName} ${service.envoy.lastName}`.trim() : fallbackName,
      avatarUrl: resolveAssetUrl(service.envoy?.imageUrl ?? service.imageUrl),
      services: []
    };
    const offerings = service.envoy?.services?.length ? service.envoy.services : [service];
    for (const offering of offerings) {
      if (!group.services.some((item) => item.id === offering.id)) group.services.push(offering);
    }
    groups.set(providerId, group);
  }
  return Array.from(groups.values());
}

function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const { data, isLoading, error } = usePublicServices(query);
  const mine = useMyServicesAny(Boolean(session));
  const myServices = session ? (mine.data ?? []).filter((service) => service.status === "ACTIVE") : [];
  const providerGroups = useMemo(() => groupServices(data ?? []), [data]);
  const myGroups = useMemo(() => groupServices(myServices, "You"), [myServices]);

  useEffect(() => setQuery(searchParams.get("q") || ""), [searchParams]);

  return (
    <PageShell title="Services Directory" description="Browse member providers and see every service they offer.">
      <div className="mb-5 rounded-2xl border border-border bg-white p-4">
        <label htmlFor="service-search" className="mb-2 block text-sm font-medium">Search services or providers</label>
        <input id="service-search" className="input" placeholder="Try tailoring, plumbing, design, or a provider’s name" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      {session && myGroups.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div><h2 className="text-xl font-semibold">My services</h2><p className="text-sm text-foreground-secondary">Your active listings are grouped together.</p></div>
            <button className="btn-secondary" onClick={() => router.push("/envoy/services")}>Manage</button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myGroups.map((group) => <ProviderServicesCard key={group.id} providerName={group.name} avatarUrl={group.avatarUrl} services={group.services} onOpen={(id) => router.push(`/services/${id}`)} />)}
          </div>
        </section>
      )}

      {isLoading && <p className="text-foreground-secondary">Loading services…</p>}
      {error && <p role="alert" className="text-destructive">Failed to load services. {(error as Error).message || "Please try again."}</p>}
      {!isLoading && !error && providerGroups.length === 0 && (
        <div className="rounded-2xl border border-border bg-white p-6"><p className="font-medium">No services found</p><p className="mt-1 text-sm text-foreground-secondary">Try a different search, or check back as more members add their services.</p></div>
      )}
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providerGroups.map((group) => <ProviderServicesCard key={group.id} providerName={group.name} avatarUrl={group.avatarUrl} services={group.services} onOpen={(id) => router.push(`/services/${id}`)} />)}
      </div>
    </PageShell>
  );
}

export default function Page() {
  return <Suspense fallback={<PageShell title="Services Directory" description="Browse member providers and their services."><p className="text-foreground-secondary">Loading services…</p></PageShell>}><ServicesPageContent /></Suspense>;
}
