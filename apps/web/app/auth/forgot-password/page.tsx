"use client";

import { useRouter } from "next/navigation";
import { ForgotPasswordPage } from "@envoysjobs/ui";
import { useApi } from "@/lib/useApi";

export default function Page() {
  const router = useRouter();
  const api = useApi();

  const handleReset = async (email: string) => {
    const result = await api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    if (result.error) throw new Error("Unable to send reset instructions");
  };

  return (
    <ForgotPasswordPage
      onNavigate={() => router.push("/auth/login")}
      onResetRequest={handleReset}
    />
  );
}
