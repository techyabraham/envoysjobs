"use client";

import { useRouter } from "next/navigation";
import { RoleSelectionPage } from "@envoysjobs/ui";

export default function Page() {
  const router = useRouter();

  return (
    <RoleSelectionPage
      onRoleSelect={(role) => {
        const target = role === "hirer" ? "HIRER" : "ENVOY";
        router.push(`/auth/signup?role=${target}`);
      }}
    />
  );
}
