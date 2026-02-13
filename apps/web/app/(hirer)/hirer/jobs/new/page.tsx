"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CONTACT_LABELS, type ContactMethod } from "@/lib/contact";

export default function Page() {
  const api = useApi();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState<"ONSITE" | "REMOTE" | "HYBRID">("REMOTE");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>(["PLATFORM"]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    if (status === "loading") {
      setLoading(false);
      setError("Please wait, loading session...");
      return;
    }
    const role = (session as any)?.user?.role as string | undefined;
    if (!session) {
      setLoading(false);
      setError("Please sign in to post a job.");
      router.push("/auth/login");
      return;
    }
    if (role !== "HIRER") {
      setLoading(false);
      setError("Hirer account required to post jobs.");
      return;
    }

    const payload = {
      title,
      description,
      locationType,
      location: location || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      contactMethods,
      contactEmail: contactEmail || undefined,
      contactWebsite: contactWebsite || undefined,
      contactWhatsapp: contactWhatsapp || undefined,
      status: "DRAFT"
    };

    const res = await api("/jobs", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    setLoading(false);
    if (res.error) {
      setError("Failed to create job.");
      return;
    }

    router.push("/hirer/jobs");
  };

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="Post a new job" description="Share a trusted opportunity with Envoys.">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick links</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/hirer/jobs" className="btn-secondary">Manage Jobs</Link>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input
            className="input"
            placeholder="Job title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            className="input min-h-[120px]"
            placeholder="Job description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="input"
              value={locationType}
              onChange={(event) => setLocationType(event.target.value as any)}
            >
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
            </select>
            <input
              className="input"
              placeholder="Location (optional)"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Salary min"
              value={salaryMin}
              onChange={(event) => setSalaryMin(event.target.value)}
            />
            <input
              className="input"
              placeholder="Salary max"
              value={salaryMax}
              onChange={(event) => setSalaryMax(event.target.value)}
            />
          </div>
          <div className="bg-background-secondary border border-border rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">How should envoys apply?</p>
              <p className="text-xs text-foreground-tertiary">Select all methods you want enabled.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-sm text-foreground-secondary">
              {(["PLATFORM", "EMAIL", "WEBSITE", "WHATSAPP"] as ContactMethod[]).map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactMethods.includes(method)}
                    onChange={() =>
                      setContactMethods((prev) =>
                        prev.includes(method) ? prev.filter((item) => item !== method) : [...prev, method]
                      )
                    }
                  />
                  {CONTACT_LABELS[method]}
                </label>
              ))}
            </div>
            {contactMethods.includes("EMAIL") && (
              <input
                className="input"
                placeholder="Contact email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
              />
            )}
            {contactMethods.includes("WEBSITE") && (
              <input
                className="input"
                placeholder="Application website URL"
                value={contactWebsite}
                onChange={(event) => setContactWebsite(event.target.value)}
              />
            )}
            {contactMethods.includes("WHATSAPP") && (
              <input
                className="input"
                placeholder="WhatsApp number (e.g. 0803 000 0000)"
                value={contactWhatsapp}
                onChange={(event) => setContactWhatsapp(event.target.value)}
              />
            )}
          </div>
          {error && <p className="text-destructive">{error}</p>}
          <button className="cta" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish"}
          </button>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
