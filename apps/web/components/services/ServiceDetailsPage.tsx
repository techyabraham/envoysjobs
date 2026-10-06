"use client";

import Image from "next/image";
import { resolveAssetUrl } from "@/lib/api";
import { buildWhatsappIntentUrl, type ContactMethod } from "@/lib/contact";

type ServiceDetailsPageProps = {
  service: {
    id: string;
    title: string;
    description: string;
    rate: string;
    imageUrl?: string | null;
    contactMethods?: ContactMethod[];
    contactEmail?: string | null;
    contactWebsite?: string | null;
    contactWhatsapp?: string | null;
    envoy?: { firstName: string; lastName: string };
  };
  onBack: () => void;
  onPlatformRequest: () => Promise<void>;
  requesting: boolean;
};

export default function ServiceDetailsPage({ service, onBack, onPlatformRequest, requesting }: ServiceDetailsPageProps) {
  const methods = service.contactMethods?.length ? service.contactMethods : (["PLATFORM"] as ContactMethod[]);

  const providerName = service.envoy
    ? `${service.envoy.firstName} ${service.envoy.lastName}`
    : "Envoy";

  const whatsappDetails = [
    `Service: ${service.title}`,
    `Provider: ${providerName}`,
    `Rate: ${service.rate}`,
    `Description: ${service.description}`
  ].join("\n");

  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl bg-background-secondary border border-border flex items-center justify-center overflow-hidden">
          {resolveAssetUrl(service.imageUrl) ? (
            <Image
              src={resolveAssetUrl(service.imageUrl) as string}
              alt={service.title}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-foreground-tertiary text-sm">No image</span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{service.title}</h2>
          <p className="text-foreground-secondary">{service.rate}</p>
          <p className="text-sm text-foreground-tertiary">Provided by {providerName}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Full Description</h3>
        <p className="text-foreground-secondary whitespace-pre-wrap">{service.description}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {methods.map((method) => {
          if (method === "WHATSAPP") {
            const url = buildWhatsappIntentUrl(
              service.contactWhatsapp,
              `Hello, I want to purchase this service via EnvoysJobs.\n${whatsappDetails}`
            );
            if (!url) return null;
            return (
              <button key={method} className="cta" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
                Message on WhatsApp
              </button>
            );
          }
          if (method === "EMAIL" && service.contactEmail) {
            const subject = encodeURIComponent(`Service enquiry: ${service.title}`);
            const body = encodeURIComponent(`Hello ${providerName}, I’m interested in your ${service.title} service. Please let me know your availability.\n\n${whatsappDetails}`);
            return (
              <button key={method} className="cta" onClick={() => (window.location.href = `mailto:${service.contactEmail}?subject=${subject}&body=${body}`)}>
                Email this provider
              </button>
            );
          }
          if (method === "WEBSITE" && service.contactWebsite) {
            return (
              <button key={method} className="cta" onClick={() => window.open(service.contactWebsite!, "_blank", "noopener,noreferrer")}>
                Visit provider website
              </button>
            );
          }
          if (method === "PLATFORM") {
            return (
              <button key={method} className="cta" onClick={onPlatformRequest} disabled={requesting}>
                {requesting ? "Sending enquiry…" : "Request this service"}
              </button>
            );
          }
          return null;
        })}
        <button className="btn-secondary" onClick={onBack}>Back to Services</button>
      </div>
    </div>
  );
}
