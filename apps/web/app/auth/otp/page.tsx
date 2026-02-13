import { Suspense } from "react";
import OtpPageClient from "@/components/auth/OtpPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-secondary" />}>
      <OtpPageClient />
    </Suspense>
  );
}
