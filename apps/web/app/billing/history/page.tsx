import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Payment History" description="Coming soon.">
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-foreground-secondary">Your payment history will appear here.</p>
      </div>
    </PageShell>
  );
}
