import { Suspense } from "react";
import SignupClient from "../../../components/auth/SignupClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-secondary" />}>
      <SignupClient />
    </Suspense>
  );
}
