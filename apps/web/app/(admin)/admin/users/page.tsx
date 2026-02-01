import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell title="Admin Users" description="Manage Envoys and Hirers.">
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-foreground-secondary">User moderation queue.</p>
      </div>
    </PageShell>
  );
}
