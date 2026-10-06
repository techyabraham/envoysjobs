"use client";

import PageShell from "@/components/PageShell";
import { useService, useServiceInquiry } from "@/lib/services";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ServiceDetailsPage from "@/components/services/ServiceDetailsPage";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: session } = useSession();
  const { data, isLoading, error } = useService(id);
  const inquiry = useServiceInquiry(id);

  return (
    <PageShell title="Service details" description="Contact a member provider about their service.">
      {isLoading && <p className="text-foreground-secondary">Loading service...</p>}
      {error && <p className="text-destructive">Failed to load service.</p>}
      {data ? (
        <ServiceDetailsPage
          service={data}
          requesting={inquiry.isPending}
          onBack={() => router.push("/services")}
          onPlatformRequest={async () => {
            if (!session) {
              router.push("/auth/login");
              return;
            }
            try {
              await inquiry.mutateAsync({
                method: "PLATFORM",
                message: `I am interested in this service: ${data.title}. Rate: ${data.rate}.`
              });
              alert("Your service enquiry was sent to the provider.");
            } catch {
              alert("Unable to send interest.");
            }
          }}
        />
      ) : !isLoading && !error ? (
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-foreground-secondary">Service not found.</p>
        </div>
      ) : null}
    </PageShell>
  );
}
