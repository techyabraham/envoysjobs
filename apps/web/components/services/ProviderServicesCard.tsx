"use client";

import Image from "next/image";

export type ProviderOffering = {
  id: string;
  title: string;
  description: string;
  rate: string;
};

export default function ProviderServicesCard({
  providerName,
  avatarUrl,
  services,
  onOpen
}: {
  providerName: string;
  avatarUrl?: string | null;
  services: ProviderOffering[];
  onOpen: (serviceId: string) => void;
}) {
  const initials = providerName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "M";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background-secondary font-semibold text-foreground">
          {avatarUrl ? <Image src={avatarUrl} alt="" width={48} height={48} unoptimized className="h-full w-full object-cover" /> : <span aria-hidden="true">{initials}</span>}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-foreground">{providerName}</h2>
          <p className="text-sm text-foreground-tertiary">Member service provider</p>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Services offered</h3>
        <span className="rounded-full bg-background-secondary px-2.5 py-1 text-xs text-foreground-secondary">{services.length}</span>
      </div>
      <ul className="mb-5 divide-y divide-border">
        {services.map((service) => (
          <li key={service.id} className="py-3 first:pt-2 last:pb-0">
            <button type="button" onClick={() => onOpen(service.id)} className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue">
              <span className="flex items-start justify-between gap-3">
                <span className="font-medium text-foreground">{service.title}</span>
                <span className="shrink-0 text-sm font-medium text-emerald-green">{service.rate}</span>
              </span>
              <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-foreground-secondary">{service.description}</span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="btn-secondary mt-auto min-h-11 w-full" onClick={() => services[0] && onOpen(services[0].id)}>
        View provider details
      </button>
    </article>
  );
}
