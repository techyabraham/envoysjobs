"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PageShell from "@/components/PageShell";
import { DEAL_CATEGORIES, useDeals, useMyDeals, useUpdateDealStatus } from "@/lib/deals";

function dateLabel(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "No end date";
}

export default function DealsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const deals = useDeals(query, category, Boolean(session));
  const mine = useMyDeals(Boolean(session));
  const updateStatus = useUpdateDealStatus();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login?callbackUrl=/deals");
  }, [status, router]);

  if (!session) return <PageShell title="Member Deals" description="Sign in to browse offers shared by your community."><p>Loading member offers…</p></PageShell>;

  return (
    <PageShell title="Member Deals" description="Promotions and special offers shared by members. Check each offer’s terms and validity before purchasing.">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-secondary">Shared by members; purchases and redemption are arranged directly with the seller.</p>
        <button className="cta" onClick={() => router.push("/deals/new")}>Share a deal</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_240px]">
        <input className="input" placeholder="Search offers, shops, or services" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {DEAL_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {mine.data && mine.data.length > 0 && <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your shared deals</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {mine.data.map((deal) => <div key={deal.id} className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{deal.title}</p><p className="text-sm text-foreground-secondary">{deal.offer} · {deal.status.toLowerCase()}</p></div>
              {(deal.status === "ACTIVE" || deal.status === "PAUSED") && <button className="btn-secondary" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: deal.id, status: deal.status === "ACTIVE" ? "PAUSED" : "ACTIVE" })}>{deal.status === "ACTIVE" ? "Pause" : "Reactivate"}</button>}
            </div>
          </div>)}
        </div>
      </section>}
      {deals.isLoading && <p className="text-foreground-secondary">Loading deals…</p>}
      {deals.isError && <p className="text-destructive">Could not load deals. {(deals.error as Error).message}</p>}
      {!deals.isLoading && !deals.isError && !deals.data?.length && <div className="rounded-2xl border border-border bg-white p-6"><p className="font-medium">No deals match yet.</p><p className="mt-1 text-sm text-foreground-secondary">Share the first offer with your community.</p></div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deals.data?.map((deal) => <button key={deal.id} onClick={() => router.push(`/deals/${deal.id}`)} className="rounded-2xl border border-border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-2">
          <div className="mb-4 flex items-center justify-between gap-2"><span className="rounded-full bg-background-secondary px-3 py-1 text-xs">{deal.category}</span>{deal.location && <span className="text-xs text-foreground-tertiary">{deal.location}</span>}</div>
          <p className="text-xl font-semibold">{deal.offer}</p><h2 className="mt-1 font-medium">{deal.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary">{deal.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-foreground-tertiary"><span>By {deal.owner ? `${deal.owner.firstName} ${deal.owner.lastName}` : "a member"}</span><span>Until {dateLabel(deal.endsAt)}</span></div>
        </button>)}
      </div>
    </PageShell>
  );
}
