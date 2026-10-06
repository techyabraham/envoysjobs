"use client";

import Image from "next/image";

type ServiceCardServiceFirstProps = {
  serviceId: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  provider: {
    name: string;
    avatarUrl?: string;
  };
  onRequestService?: (serviceId: string) => void;
  onOpenDetails?: (serviceId: string) => void;
};

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "EJ"
  );
}

export default function ServiceCardServiceFirst({
  serviceId,
  title,
  shortDescription,
  tags,
  provider,
  onRequestService,
  onOpenDetails
}: ServiceCardServiceFirstProps) {
  const initials = getInitials(provider.name);
  const safeTags = (tags ?? []).filter(Boolean).slice(0, 3);
  return (
    <article className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug break-words line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-foreground-secondary mt-2 leading-relaxed line-clamp-3">
          {shortDescription}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        {safeTags.map((tag) => (
          <span
            key={`${serviceId}-${tag}`}
            className="px-3 py-1.5 rounded-full border border-border text-xs leading-none text-foreground-secondary bg-background"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 text-left">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-background-secondary border border-border flex items-center justify-center text-sm font-semibold text-foreground shrink-0">
          {provider.avatarUrl ? (
            <Image
              src={provider.avatarUrl}
              alt=""
              width={44}
              height={44}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-foreground-tertiary">Provided by</p>
          <p className="text-sm font-semibold text-foreground leading-tight mt-1 truncate">{provider.name}</p>
        </div>
      </div>

      <button
        type="button"
        className="cta w-full min-h-12 mt-auto rounded-xl text-base"
        onClick={() => (onOpenDetails ?? onRequestService)?.(serviceId)}
      >
        View service
      </button>
    </article>
  );
}
