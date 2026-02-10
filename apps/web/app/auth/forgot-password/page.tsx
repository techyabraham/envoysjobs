"use client";

import { useRouter } from "next/navigation";
import { ForgotPasswordPage } from "@envoysjobs/ui";
import { useApi } from "@/lib/useApi";

export default function Page() {
  const router = useRouter();
  const api = useApi();

  const handleReset = async (email: string) => {
    await api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    router.push("/auth/login");
  };

  return (
    <ForgotPasswordPage
      onNavigate={() => router.push("/auth/login")}
      onResetRequest={handleReset}
    />
  );
}
