"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export default function AdminGate({ children }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = (session as any)?.user?.role as string | undefined;

  useEffect(() => {
    if (status === "loading") return;
    if (!session || role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [status, session, role, router]);

  if (status === "loading") {
    return <div className="min-h-screen bg-background-secondary" />;
  }

  if (!session || role !== "ADMIN") {
    return <div className="min-h-screen bg-background-secondary" />;
  }

  return <>{children}</>;
}
