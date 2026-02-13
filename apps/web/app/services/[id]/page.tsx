"use client";

import PageShell from "@/components/PageShell";
import { useService, useServiceInquiry } from "@/lib/services";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { buildWhatsappUrl, CONTACT_LABELS, type ContactMethod } from "@/lib/contact";
import { useSession } from "next-auth/react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: session } = useSession();
  const { data, isLoading, error } = useService(id);
  const inquiry = useServiceInquiry(id);

  const methods = data?.contactMethods?.length ? data.contactMethods : (["PLATFORM"] as ContactMethod[]);

  return (
    <PageShell title="Service" description="Service details and envoy profile.">
      {isLoading && <p className="text-foreground-secondary">Loading service...</p>}
      {error && <p className="text-destructive">Failed to load service.</p>}
      {data ? (
        <div className="bg-white border border-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl bg-background-secondary border border-border flex items-center justify-center overflow-hidden">
              {data.imageUrl ? (
                <img
                  src={`${API_BASE_URL}${data.imageUrl}`}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-foreground-tertiary text-sm">No image</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{data.title}</h2>
              <p className="text-foreground-secondary">{data.rate}</p>
              {data.envoy && (
                <p className="text-sm text-foreground-tertiary">
                  By {data.envoy.firstName} {data.envoy.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-foreground-secondary">{data.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {methods.map((method) => {
              if (method === "WHATSAPP") {
                const url = buildWhatsappUrl(data.contactWhatsapp);
                if (!url) return null;
                return (
                  <button key={method} className="cta" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
                    {CONTACT_LABELS[method]}
                  </button>
                );
              }
              if (method === "EMAIL" && data.contactEmail) {
                return (
                  <button key={method} className="cta" onClick={() => window.location.href = `mailto:${data.contactEmail}`}>
                    {CONTACT_LABELS[method]}
                  </button>
                );
              }
              if (method === "WEBSITE" && data.contactWebsite) {
                return (
                  <button key={method} className="cta" onClick={() => window.open(data.contactWebsite!, "_blank", "noopener,noreferrer")}>
                    {CONTACT_LABELS[method]}
                  </button>
                );
              }
              if (method === "PLATFORM") {
                return (
                  <button
                    key={method}
                    className="cta"
                    onClick={async () => {
                      if (!session) {
                        router.push("/auth/login");
                        return;
                      }
                      try {
                        await inquiry.mutateAsync({ method: "PLATFORM", message: "I am interested in this service." });
                        alert("Interest sent to envoy.");
                      } catch {
                        alert("Unable to send interest.");
                      }
                    }}
                    disabled={inquiry.isPending}
                  >
                    {inquiry.isPending ? "Sending..." : "Contact on EnvoysJobs"}
                  </button>
                );
              }
              return null;
            })}
            <button className="btn-secondary" onClick={() => router.push("/services")}>Back to Services</button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
