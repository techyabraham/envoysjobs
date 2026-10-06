"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PageShell from "@/components/PageShell";
import { DEAL_CATEGORIES, useCreateDeal } from "@/lib/deals";

function localDate(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

export default function NewDealPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const createDeal = useCreateDeal();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", offer: "", category: "Other", description: "", promoCode: "", redemptionInstructions: "", location: "", startsAt: "", endsAt: "", contactEmail: "", contactWebsite: "", contactWhatsapp: "" });
  useEffect(() => { if (status === "unauthenticated") router.replace("/auth/login?callbackUrl=/deals/new"); }, [status, router]);
  const change = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const methods = [form.contactEmail && "EMAIL", form.contactWebsite && "WEBSITE", form.contactWhatsapp && "WHATSAPP"].filter(Boolean) as string[];
    try {
      const deal = await createDeal.mutateAsync({ ...form, category: form.category as (typeof DEAL_CATEGORIES)[number], promoCode: form.promoCode || undefined, location: form.location || undefined, contactEmail: form.contactEmail || undefined, contactWebsite: form.contactWebsite || undefined, contactWhatsapp: form.contactWhatsapp || undefined, startsAt: localDate(form.startsAt), endsAt: localDate(form.endsAt), contactMethods: methods.length ? methods : ["PLATFORM"] });
      router.push(`/deals/${deal.id}`);
    } catch (e) { setError((e as Error).message || "Could not submit deal."); }
  }

  if (!session) return <PageShell title="Share a deal"><p>Loading…</p></PageShell>;
  return <PageShell title="Share a deal" description="Post a current offer for other members. Deals are reviewed before they appear in the member directory.">
    <form onSubmit={submit} className="max-w-3xl space-y-4 rounded-2xl border border-border bg-white p-6">
      <input className="input" placeholder="Offer title" value={form.title} onChange={(e) => change("title", e.target.value)} minLength={4} maxLength={100} required />
      <input className="input" placeholder="The deal (e.g. 20% off, Buy one get one free)" value={form.offer} onChange={(e) => change("offer", e.target.value)} maxLength={120} required />
      <select className="input" value={form.category} onChange={(e) => change("category", e.target.value)}>{DEAL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      <textarea className="input min-h-32" placeholder="What is included? Mention key limits or exclusions." value={form.description} onChange={(e) => change("description", e.target.value)} minLength={10} maxLength={3000} required />
      <input className="input" placeholder="Promo code (optional)" value={form.promoCode} onChange={(e) => change("promoCode", e.target.value)} maxLength={80} />
      <textarea className="input min-h-24" placeholder="How members can redeem this offer" value={form.redemptionInstructions} onChange={(e) => change("redemptionInstructions", e.target.value)} minLength={5} maxLength={1000} required />
      <input className="input" placeholder="Location or online (optional)" value={form.location} onChange={(e) => change("location", e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Starts (optional)<input type="datetime-local" className="input mt-1" value={form.startsAt} onChange={(e) => change("startsAt", e.target.value)} /></label><label className="text-sm">Ends (optional)<input type="datetime-local" className="input mt-1" value={form.endsAt} onChange={(e) => change("endsAt", e.target.value)} /></label></div>
      <div className="space-y-3 rounded-xl bg-background-secondary p-4"><h2 className="font-medium">How can members reach you?</h2><p className="text-xs text-foreground-tertiary">Add at least one contact option. Details are visible to signed-in members.</p>
        <input className="input" type="email" placeholder="Contact email (optional)" value={form.contactEmail} onChange={(e) => change("contactEmail", e.target.value)} />
        <input className="input" type="url" placeholder="Website link (optional)" value={form.contactWebsite} onChange={(e) => change("contactWebsite", e.target.value)} />
        <input className="input" placeholder="WhatsApp number with country code (optional)" value={form.contactWhatsapp} onChange={(e) => change("contactWhatsapp", e.target.value)} />
      </div>
      <p className="text-sm text-foreground-tertiary">Buyers contact you and complete purchases directly. EnvoysJobs does not process payments or guarantee redemption.</p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3"><button className="cta" disabled={createDeal.isPending}>{createDeal.isPending ? "Submitting…" : "Submit for review"}</button><button type="button" className="btn-secondary" onClick={() => router.push("/deals")}>Cancel</button></div>
    </form>
  </PageShell>;
}
