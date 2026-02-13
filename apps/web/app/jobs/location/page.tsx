import { Suspense } from "react";
import LocationJobsClient from "@/components/jobs/LocationJobsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-secondary" />}>
      <LocationJobsClient />
    </Suspense>
  );
}
