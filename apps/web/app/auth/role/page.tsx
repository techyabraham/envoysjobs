import PageShell from "@/components/PageShell";
import Link from "next/link";

export default function Page() {
  return (
    <PageShell title="Choose your role" description="Select how you want to use EnvoysJobs.">
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/auth/signup?role=ENVOY"
          className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl mb-2">Envoy</h3>
          <p className="text-foreground-secondary">Apply for jobs, gigs, and services.</p>
        </Link>
        <Link
          href="/auth/signup?role=HIRER"
          className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl mb-2">Hirer</h3>
          <p className="text-foreground-secondary">Post roles and hire trusted Envoys.</p>
        </Link>
      </div>
    </PageShell>
  );
}
