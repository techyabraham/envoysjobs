"use client";

import PageShell from "@/components/PageShell";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Page() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const [status, setStatus] = useState<{ phone: string; steward: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/verification/status`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : ""
        }
      });
      if (!res.ok) throw new Error("Failed to load status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError("Failed to load verification status.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${apiUrl}/verification/upload`, {
        method: "POST",
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : ""
        },
        body: form
      });
      if (!res.ok) throw new Error("Upload failed");
      await fetchStatus();
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageShell title="Verification" description="Track your verification status.">
      <div className="bg-white border border-border rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-foreground-tertiary">Guidance</p>
            <p className="text-foreground-secondary">Understand verification badges and requirements.</p>
          </div>
          <Link href="/verification/badge" className="btn-secondary">
            Badge Guide
          </Link>
        </div>

        <div className="border-t border-border pt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-secondary" onClick={fetchStatus} disabled={loading}>
              {loading ? "Loading..." : "Refresh Status"}
            </button>
            {error && <p className="text-destructive">{error}</p>}
          </div>
          <div className="space-y-2 text-foreground-secondary">
            <p>Phone verification: {status?.phone ?? "PENDING"}</p>
            <p>
              Steward verification:{" "}
              {status?.steward === "NOT_APPLICABLE" ? "Not applicable" : status?.steward ?? "PENDING"}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <label className="block text-sm text-foreground-secondary mb-2">Upload ID document</label>
          <input type="file" onChange={handleUpload} disabled={uploading} />
        </div>
      </div>
    </PageShell>
  );
}
