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
    <PageShell title="Service" description="Service details and envoy profile.">
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
              alert("Interest sent to envoy.");
            } catch {
              alert("Unable to send interest.");
            }
          }}
        />
      ) : null}
    </PageShell>
  );
}
