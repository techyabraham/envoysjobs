"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PageShell from "@/components/PageShell";
import { useDeal } from "@/lib/deals";
import { buildWhatsappIntentUrl } from "@/lib/contact";

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: deal, isLoading, error } = useDeal(id, Boolean(session));
  useEffect(() => { if (status === "unauthenticated") router.replace(`/auth/login?callbackUrl=/deals/${id}`); }, [status, router, id]);
  if (!session) return <PageShell title="Member Deal"><p>Loading…</p></PageShell>;
  if (isLoading) return <PageShell title="Member Deal"><p>Loading offer…</p></PageShell>;
  if (error || !deal) return <PageShell title="Member Deal"><p className="text-destructive">This deal is unavailable or has ended.</p><button className="btn-secondary" onClick={() => router.push("/deals")}>Back to deals</button></PageShell>;
  const whatsapp = deal.contactWhatsapp ? buildWhatsappIntentUrl(deal.contactWhatsapp, `Hello, I saw your ${deal.title} offer on EnvoysJobs.`) : null;
  const links = [deal.contactEmail && { label: "Email seller", href: `mailto:${deal.contactEmail}` }, deal.contactWebsite && { label: "Visit website", href: deal.contactWebsite }, whatsapp && { label: "Message on WhatsApp", href: whatsapp }].filter(Boolean) as {label:string;href:string}[];
  return <PageShell title="Member Deal" description={`${deal.category}${deal.location ? ` · ${deal.location}` : ""}`}>
    <article className="max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-6 sm:p-8">
      <div><p className="text-3xl font-bold text-deep-blue">{deal.offer}</p><h2 className="mt-2 text-2xl font-semibold">{deal.title}</h2><p className="mt-2 text-sm text-foreground-secondary">Shared by {deal.owner ? `${deal.owner.firstName} ${deal.owner.lastName}` : "a member"}</p></div>
      <section><h3 className="mb-2 font-semibold">About this offer</h3><p className="whitespace-pre-wrap text-foreground-secondary">{deal.description}</p></section>
      <section className="rounded-xl bg-background-secondary p-4"><h3 className="font-semibold">How to redeem</h3><p className="mt-2 whitespace-pre-wrap text-sm text-foreground-secondary">{deal.redemptionInstructions}</p>{deal.promoCode && <div className="mt-4"><p className="text-xs text-foreground-tertiary">PROMO CODE</p><code className="mt-1 inline-block rounded bg-white px-3 py-2 font-semibold">{deal.promoCode}</code></div>}</section>
      <p className="text-sm text-foreground-tertiary">{deal.endsAt ? `Offer ends ${new Date(deal.endsAt).toLocaleString()}.` : "Check with the seller that this offer is still available."} Terms and fulfillment are set by the seller.</p>
      <div className="flex flex-wrap gap-3">{links.map((link) => <a className="cta" key={link.href} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{link.label}</a>)}<button className="btn-secondary" onClick={() => router.push("/deals")}>Back to deals</button></div>
    </article>
  </PageShell>;
}
