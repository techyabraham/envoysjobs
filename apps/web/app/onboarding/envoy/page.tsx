"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnvoyOnboarding, type EnvoyOnboardingData } from "@envoysjobs/ui";
import { useApi } from "@/lib/useApi";

export default function Page() {
  const router = useRouter();
  const api = useApi();
  const [initialData, setInitialData] = useState<{ phone?: string }>({});

  useEffect(() => {
    let cancelled = false;
    const loadMe = async () => {
      const res = await api<{ phone?: string }>("/me");
      if (!cancelled && !res.error && res.data) {
        setInitialData({ phone: res.data.phone || "" });
      }
    };
    loadMe();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const handleComplete = async (data: EnvoyOnboardingData) => {
    const location = [data.city, data.state].filter(Boolean).join(", ");
    const stewardDept =
      data.stewardDepartment === "OTHER" ? data.stewardDepartmentOther : data.stewardDepartment;
    const stewardEnabled = data.steward === "yes";

    const resMe = await api("/me", {
      method: "PUT",
      body: JSON.stringify({
        phone: data.phone,
        stewardStatus: stewardEnabled ? "PENDING" : null,
        stewardDepartment: stewardEnabled ? stewardDept || null : null,
        stewardMatricNumber: stewardEnabled ? data.stewardMatricNumber || null : null
      })
    });
    if (resMe.error) {
      alert("Failed to update profile.");
      return;
    }

    const resProfile = await api("/envoy/profile", {
      method: "PUT",
      body: JSON.stringify({
        location,
        availability: data.availabilityType,
        skills: data.selectedSkills.join(", "),
        memberGoals: data.memberGoals
      })
    });

    if (resProfile.error) {
      alert("Failed to save envoy profile.");
      return;
    }

    router.push("/envoy/dashboard");
  };

  return (
    <EnvoyOnboarding
      onNavigate={() => router.push("/")}
      onComplete={handleComplete}
      initialData={initialData}
    />
  );
}
