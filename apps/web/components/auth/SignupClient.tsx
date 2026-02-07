"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { SignupPage } from "@envoysjobs/ui";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") || "ENVOY").toUpperCase();

  const handleNavigate = (page: string) => {
    switch (page) {
      case "home":
        router.push("/");
        break;
      case "login":
        router.push("/auth/login");
        break;
      default:
        router.push("/");
        break;
    }
  };

  const handleSignup = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const res = await fetch(`${apiUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        role: role === "HIRER" ? "HIRER" : "ENVOY"
      })
    });
    if (!res.ok) {
      alert("Signup failed.");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password
    });

    if (result?.ok) {
      router.push(role === "HIRER" ? "/onboarding/hirer" : "/onboarding/envoy");
      return;
    }

    router.push("/auth/login");
  };

  return <SignupPage onNavigate={handleNavigate} onSignup={handleSignup} />;
}
