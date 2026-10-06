"use client";

import React from "react";
import { ArrowRight, Briefcase, ClipboardList, Tag, Wrench } from "lucide-react";
import { Card } from "../Card";
import { Button } from "../Button";

interface DashboardStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
}

interface Recommendation {
  id: string;
  title: string;
  company: string;
  location?: string | null;
}

interface DashboardOverviewProps {
  userName: string;
  onNavigate?: (page: string) => void;
  profileNeedsDetails?: boolean;
  memberGoals?: string[];
  stats?: DashboardStat[];
  recommendations?: Recommendation[];
}

export function DashboardOverview({ userName, onNavigate, profileNeedsDetails = false, memberGoals = [], stats = [], recommendations = [] }: DashboardOverviewProps) {
  const actions = [
    { label: "Find work", description: "Explore jobs from the community", icon: Briefcase, page: "find-work" },
    { label: "Offer a service", description: "List a trade or professional service", icon: Wrench, page: "offer-service" },
    { label: "Find a gig", description: "Browse flexible, short-term work", icon: ClipboardList, page: "find-gigs" },
    { label: "Browse deals", description: "See offers shared by members", icon: Tag, page: "deals" }
  ];
  const goalOrder = ["FIND_WORK", "OFFER_SERVICES", "FIND_GIGS", "SHARE_DEALS"];
  const goalForPage: Record<string, string> = {
    "find-work": "FIND_WORK",
    "offer-service": "OFFER_SERVICES",
    "find-gigs": "FIND_GIGS",
    deals: "SHARE_DEALS"
  };
  const orderedActions = memberGoals.length
    ? [...actions].sort((a, b) => {
        const aIndex = goalOrder.indexOf(goalForPage[a.page]);
        const bIndex = goalOrder.indexOf(goalForPage[b.page]);
        return (memberGoals.indexOf(goalForPage[a.page]) < 0 ? 99 : memberGoals.indexOf(goalForPage[a.page])) - (memberGoals.indexOf(goalForPage[b.page]) < 0 ? 99 : memberGoals.indexOf(goalForPage[b.page])) || aIndex - bIndex;
      })
    : actions;

  return (
    <div className="p-4 pb-24 lg:p-8 lg:pb-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="rounded-2xl bg-gradient-to-br from-deep-blue via-deep-blue-dark to-deep-blue-light p-6 text-white sm:p-8">
          <p className="text-sm font-medium text-white/75">Member dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Welcome, {userName}</h1>
          <p className="mt-2 max-w-2xl text-base text-white/85">Find work, offer services, take gigs, and share in the community marketplace.</p>
        </header>

        {profileNeedsDetails && (
          <Card className="border-soft-gold/40 bg-soft-gold/10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-foreground">Make your profile easier to trust</h2>
                <p className="mt-1 max-w-2xl text-sm text-foreground-secondary">When you’re ready, add a short introduction and work samples from your profile. You can do this later without blocking your account.</p>
              </div>
              <Button variant="accent" size="sm" onClick={() => onNavigate?.("edit-profile")}>Complete profile<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </Card>
        )}

        <section aria-label="Marketplace shortcuts" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {orderedActions.map(({ label, description, icon: Icon, page }) => (
            <button key={page} type="button" onClick={() => onNavigate?.(page)} className="group flex min-h-28 items-start gap-4 rounded-2xl border border-border bg-white p-5 text-left transition hover:border-deep-blue/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-deep-blue/10 text-deep-blue"><Icon className="h-5 w-5" /></span>
              <span><span className="block font-semibold text-foreground">{label}</span><span className="mt-1 block text-sm leading-relaxed text-foreground-secondary">{description}</span></span>
            </button>
          ))}
        </section>

        {stats.length > 0 && (
          <section aria-label="Your activity" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return <Card key={stat.label}><div className="flex items-center justify-between"><span className="text-sm text-foreground-secondary">{stat.label}</span><Icon className="h-5 w-5 text-deep-blue" /></div><p className="mt-3 text-3xl font-semibold text-foreground">{stat.value}</p>{stat.change && <p className="mt-1 text-xs text-foreground-tertiary">{stat.change}</p>}</Card>;
            })}
          </section>
        )}

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h2 className="text-xl font-semibold text-foreground">Recent opportunities</h2><p className="mt-1 text-sm text-foreground-secondary">New work shared by the community.</p></div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.("find-work")}>Browse jobs<ArrowRight className="ml-1 h-4 w-4" /></Button>
          </div>
          {recommendations.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {recommendations.map((item) => <Card key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><h3 className="font-semibold text-foreground">{item.title}</h3><p className="mt-1 text-sm text-foreground-secondary">{item.company}{item.location ? ` · ${item.location}` : ""}</p></div>
                  <Briefcase className="h-5 w-5 shrink-0 text-deep-blue" />
                </div>
                <Button variant="primary" size="sm" className="mt-4" onClick={() => onNavigate?.(`job:${item.id}`)}>View job</Button>
              </Card>)}
            </div>
          ) : (
            <Card><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-medium text-foreground">Nothing new to show yet</p><p className="mt-1 text-sm text-foreground-secondary">Browse the job board, or explore services and deals from members.</p></div><Button variant="outline" size="sm" onClick={() => onNavigate?.("find-work")}>Explore opportunities</Button></div></Card>
          )}
        </section>
      </div>
    </div>
  );
}
