"use client";

import { useRouter } from "next/navigation";
import { EnvoyOnboarding } from "@envoysjobs/ui";
import { useApi } from "@/lib/useApi";

export default function Page() {
  const router = useRouter();
  const api = useApi();

  const handleComplete = async (data: any) => {
    const location = [data.city, data.state].filter(Boolean).join(", ");
    const skills = Array.isArray(data.selectedSkills) ? data.selectedSkills.join(", ") : "";
    const stewardDept =
      data.stewardDepartment === "OTHER" ? data.stewardDepartmentOther : data.stewardDepartment;
    const stewardEnabled = data.steward === "yes";

    const resMe = await api("/me", {
      method: "PUT",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
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
        bio: data.bio,
        portfolioLinks: data.portfolio,
        skills
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
    />
  );
}
