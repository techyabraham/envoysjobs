"use client";

import { useRouter } from "next/navigation";
import { WelcomePage } from "@envoysjobs/ui";

export default function Page() {
  const router = useRouter();
  return (
    <WelcomePage
      onNavigate={(page) => {
        if (page === "signup") router.push("/auth/signup");
        else if (page === "login") router.push("/auth/login");
        else router.push("/");
      }}
    />
  );
}
