"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { Button } from "@envoysjobs/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const api = useApi();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const result = await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      if (result.error) throw new Error("Password reset failed");
      router.push("/auth/login?passwordReset=1");
    } catch {
      setMessage("This reset link is invalid or expired. Request a new one and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title="Reset your password" description="Choose a new password for your account.">
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md space-y-4 rounded-2xl border border-border bg-white p-6">
        <label className="block space-y-2">
          <span className="text-sm font-medium">New password</span>
          <input
            className="input w-full"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {message ? <p role="alert" className="text-sm text-destructive">{message}</p> : null}
        <Button className="w-full" size="lg" type="submit" disabled={!token || submitting}>
          {submitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </PageShell>
  );
}
