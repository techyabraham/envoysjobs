"use client";

import { useRouter } from "next/navigation";
import { HirerOnboarding } from "@envoysjobs/ui";
import { useApi } from "@/lib/useApi";

export default function Page() {
  const router = useRouter();
  const api = useApi();

  const handleComplete = async (data: any) => {
    const stewardDept =
      data.stewardDepartment === "OTHER" ? data.stewardDepartmentOther : data.stewardDepartment;
    const stewardEnabled = data.steward === "yes";

    const resMe = await api("/me", {
      method: "PUT",
      body: JSON.stringify({
        stewardStatus: stewardEnabled ? "PENDING" : null,
        stewardDepartment: stewardEnabled ? stewardDept || null : null,
        stewardMatricNumber: stewardEnabled ? data.stewardMatricNumber || null : null
      })
    });

    if (resMe.error) {
      alert("Failed to update profile.");
      return;
    }

    const resProfile = await api("/hirer/profile", {
      method: "PUT",
      body: JSON.stringify({
        type: data.hirerType === "business" ? "BUSINESS" : "INDIVIDUAL",
        businessName: data.companyName || null
      })
    });

    if (resProfile.error) {
      alert("Failed to save hirer profile.");
      return;
    }

    router.push("/hirer/dashboard");
  };

  return (
    <HirerOnboarding
      onNavigate={() => router.push("/")}
      onComplete={handleComplete}
    />
  );
}
