import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Featured Job Posting" description="Coming soon.">
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-foreground-secondary">Feature your job listings to reach more Envoys.</p>
      </div>
    </PageShell>
  );
}
