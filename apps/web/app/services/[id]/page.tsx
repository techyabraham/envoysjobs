"use client";

import PageShell from "@/components/PageShell";
import { useService } from "@/lib/services";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data, isLoading, error } = useService(id);

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
            <button className="cta" onClick={() => router.push("/messages")}>Message Envoy</button>
            <button className="btn-secondary" onClick={() => router.push("/services")}>Back to Services</button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
