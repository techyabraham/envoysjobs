"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPVerificationPage } from "@envoysjobs/ui";
import { useApi } from "@/lib/useApi";

export default function OtpPageClient() {
  const router = useRouter();
  const api = useApi();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phone) return;
    api("/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone })
    }).then((res) => {
      if (res.error) setError("Unable to send OTP.");
    }).catch(() => {
      setError("Unable to send OTP.");
    });
  }, [api, phone]);

  const handleVerify = async (otp: string) => {
    if (!phone) {
      setError("Phone number missing.");
      return;
    }
    const res = await api("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code: otp })
    });
    if (res.error) {
      setError("Invalid code. Try again.");
      return;
    }
    router.push("/auth/login");
  };

  const handleResend = async () => {
    if (!phone) return;
    const res = await api("/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone })
    });
    setError(res.error ? "Unable to send OTP." : null);
  };

  return (
    <>
      {error ? <div className="p-4 text-destructive text-sm">{error}</div> : null}
      <OTPVerificationPage
        onNavigate={() => router.push("/auth/signup")}
        onVerify={handleVerify}
        onResend={handleResend}
        verificationType="phone"
        contactInfo={phone || "your phone number"}
      />
    </>
  );
}
