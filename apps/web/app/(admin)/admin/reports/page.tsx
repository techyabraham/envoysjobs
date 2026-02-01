import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Reports" description="Handle community reports.">
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-foreground-secondary">No reports at this time.</p>
      </div>
    </PageShell>
  );
}
