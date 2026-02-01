import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Admin Jobs" description="Review job postings.">
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-foreground-secondary">Jobs awaiting approval.</p>
      </div>
    </PageShell>
  );
}
