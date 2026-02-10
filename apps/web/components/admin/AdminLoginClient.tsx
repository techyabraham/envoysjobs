"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginPage } from "@envoysjobs/ui";

export default function AdminLoginClient() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    switch (page) {
      case "home":
        router.push("/");
        break;
      case "signup":
        router.push("/auth/signup");
        break;
      default:
        router.push("/");
        break;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    if (result?.ok) {
      router.push("/admin");
      return;
    }
    alert("Login failed. Check your credentials.");
  };

  return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
}
