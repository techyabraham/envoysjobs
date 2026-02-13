"use client";

import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { LoginPage } from "@envoysjobs/ui";

export default function LoginClient() {
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
      const session = await getSession();
      const role = (session as any)?.user?.role as string | undefined;
      if (role === "ADMIN") {
        router.push("/admin");
        return;
      }
      if (role === "HIRER") {
        router.push("/hirer/dashboard");
        return;
      }
      router.push("/envoy/dashboard");
      return;
    }
    alert("Login failed. Check your credentials.");
  };

  return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
}
