"use client";

import { Star } from "lucide-react";
import Image from "next/image";

type ServiceCardServiceFirstProps = {
  serviceId: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
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
  rating,
  reviewCount,
  tags,
  provider,
  onRequestService,
  onOpenDetails
}: ServiceCardServiceFirstProps) {
  const initials = getInitials(provider.name);
  const safeTags = tags.filter(Boolean).slice(0, 3);
  const ratingLabel = Number.isFinite(rating) ? rating.toFixed(1) : "0.0";

  return (
    <article className="bg-white border border-border rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
      <button
        type="button"
        className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue rounded-md"
        onClick={() => onOpenDetails?.(serviceId)}
        aria-label={`Open ${title} details`}
      >
        <h3 className="text-3xl md:text-[2rem] font-semibold text-foreground leading-tight break-words">
          {title}
        </h3>
        <p className="text-base md:text-lg text-foreground-secondary mt-2 md:mt-3 leading-relaxed line-clamp-2">
          {shortDescription}
        </p>
      </button>

      <div className="h-px bg-border mt-4 md:mt-5 mb-4" />

      <div className="flex items-center gap-2 text-foreground mb-4 md:mb-5">
        <Star className="w-6 h-6 md:w-7 md:h-7 fill-soft-gold text-soft-gold" />
        <span className="text-3xl md:text-[2.25rem] font-semibold text-foreground leading-none">{ratingLabel}</span>
        <span className="text-2xl md:text-[1.875rem] text-foreground-secondary leading-none">({reviewCount})</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-5 md:mb-6">
        {safeTags.map((tag) => (
          <span
            key={`${serviceId}-${tag}`}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-border text-sm md:text-lg leading-none text-foreground-secondary bg-background"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpenDetails?.(serviceId)}
        className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 text-left"
        aria-label={`Open provider details for ${provider.name}`}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-background-secondary border border-border flex items-center justify-center text-sm md:text-base font-semibold text-foreground">
          {provider.avatarUrl ? (
            <Image
              src={provider.avatarUrl}
              alt={provider.name}
              width={64}
              height={64}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <p className="text-lg md:text-2xl text-foreground-secondary leading-none">Provided by</p>
          <p className="text-2xl md:text-[2rem] font-semibold text-foreground leading-tight mt-1">{provider.name}</p>
        </div>
      </button>

      <button
        type="button"
        className="cta w-full mt-auto py-3 md:py-4 text-2xl md:text-[2rem] rounded-2xl"
        onClick={() => onRequestService?.(serviceId)}
      >
        Request Service
      </button>
    </article>
  );
}
