"use client";

import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";
import PageShell from "@/components/PageShell";
import { useAdminDeals, useUpdateAdminDealStatus } from "@/lib/admin";

export default function AdminDealsPage() {
  const deals = useAdminDeals();
  const update = useUpdateAdminDealStatus();
  return <AdminGate><PageShell title="Review deals" description="Approve offers for the member directory or pause and reject posts that no longer meet community guidelines.">
    {deals.isLoading && <p>Loading submissions…</p>}
    {deals.isError && <p className="text-destructive">Unable to load deal submissions.</p>}
    {!deals.isLoading && !deals.data?.length && <div className="rounded-xl border border-border bg-white p-5">No deal submissions yet.</div>}
    <div className="space-y-3">{deals.data?.map((deal) => <article key={deal.id} className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold">{deal.title}</h2><span className="rounded-full bg-background-secondary px-3 py-1 text-xs">{deal.status}</span></div><p className="mt-1 font-medium">{deal.offer} · {deal.category}</p><p className="mt-1 text-sm text-foreground-secondary">{deal.description}</p><p className="mt-2 text-xs text-foreground-tertiary">By {deal.owner ? `${deal.owner.firstName} ${deal.owner.lastName} · ${deal.owner.email}` : "unknown member"} · {new Date(deal.createdAt).toLocaleString()}</p></div>
        <Link className="text-sm text-deep-blue underline" href={`/deals/${deal.id}`} target="_blank">Preview</Link>
      </div>
      <div className="flex flex-wrap gap-2">{deal.status !== "ACTIVE" && <button className="cta" disabled={update.isPending} onClick={() => update.mutate({ id: deal.id, status: "ACTIVE" })}>Approve</button>}{deal.status !== "PAUSED" && <button className="btn-secondary" disabled={update.isPending} onClick={() => update.mutate({ id: deal.id, status: "PAUSED" })}>Pause</button>}{deal.status !== "REJECTED" && <button className="btn-secondary" disabled={update.isPending} onClick={() => update.mutate({ id: deal.id, status: "REJECTED" })}>Reject</button>}</div>
    </article>)}</div>
  </PageShell></AdminGate>;
}
