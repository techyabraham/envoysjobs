"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateGig } from "@/lib/gigs";
import { useSession } from "next-auth/react";
import { CONTACT_LABELS, type ContactMethod } from "@/lib/contact";

export default function Page() {
  const router = useRouter();
  const createGig = useCreateGig();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("4 hours");
  const [urgent, setUrgent] = useState(false);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>(["PLATFORM"]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (status === "loading") {
      setError("Please wait, loading session...");
      return;
    }
    const role = (session as any)?.user?.role as string | undefined;
    if (!session) {
      setError("Please sign in to post a gig.");
      router.push("/auth/login");
      return;
    }
    if (role !== "ENVOY") {
      setError("Envoy account required to post gigs.");
      return;
    }
    try {
      await createGig.mutateAsync({
        title,
        description,
        amount,
        location,
        duration,
        urgent,
        contactMethods,
        contactEmail: contactEmail || undefined,
        contactWebsite: contactWebsite || undefined,
        contactWhatsapp: contactWhatsapp || undefined
      });
      router.push("/envoy/gigs");
    } catch (err: any) {
      setError(err?.message || "Unable to post gig");
    }
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Post a Gig" description="Share a short-term opportunity with Envoys.">
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <input
            className="input"
            placeholder="Gig title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            className="input min-h-[120px]"
            placeholder="Describe the gig requirements"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Amount (e.g. NGN 15,000)"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />
          <select className="input" value={duration} onChange={(event) => setDuration(event.target.value)} required>
            <option value="1 hour">1 hour</option>
            <option value="2 hours">2 hours</option>
            <option value="4 hours">4 hours</option>
            <option value="8 hours">8 hours</option>
            <option value="12 hours">12 hours</option>
            <option value="24 hours">24 hours</option>
            <option value="2 days">2 days</option>
            <option value="3 days">3 days</option>
            <option value="1 week">1 week</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-foreground-secondary">
            <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
            Mark as urgent
          </label>
          <div className="bg-background-secondary border border-border rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">How should applicants reach you?</p>
              <p className="text-xs text-foreground-tertiary">Select all that apply.</p>
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
                placeholder="Website link"
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button className="cta" type="submit" disabled={createGig.isPending}>
              {createGig.isPending ? "Saving..." : "Post Gig"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.push("/envoy/gigs")}
              disabled={createGig.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
