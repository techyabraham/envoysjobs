"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useJob } from "@/lib/jobs";
import { useCreateConversation } from "@/lib/messaging";
import { useApi } from "@/lib/useApi";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { buildWhatsappUrl, CONTACT_LABELS, type ContactMethod } from "@/lib/contact";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const api = useApi();
  const { data: session } = useSession();
  const jobId = params?.id as string;
  const { data: job, isLoading, error } = useJob(jobId);
  const createConversation = useCreateConversation();
  const methods = job?.contactMethods?.length ? job.contactMethods : (["PLATFORM"] as ContactMethod[]);

  const handleApply = async () => {
    if (!jobId) return;
    if (methods.includes("WHATSAPP")) {
      const url = buildWhatsappUrl(job?.contactWhatsapp);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
    }
    if (methods.includes("EMAIL") && job?.contactEmail) {
      window.location.href = `mailto:${job.contactEmail}`;
      return;
    }
    if (methods.includes("WEBSITE") && job?.contactWebsite) {
      window.open(job.contactWebsite, "_blank", "noopener,noreferrer");
      return;
    }
    if (methods.includes("PLATFORM")) {
      const res = await api(`/jobs/${jobId}/apply`, { method: "POST" });
      if (res.error) {
        alert("Failed to apply.");
        return;
      }
      router.push("/envoy/applications");
    }
  };

  const handleMessage = async () => {
    if (!jobId || !job?.hirerId) return;
    const envoyId = (session as any)?.user?.id as string | undefined;
    if (!envoyId) return;
    const convo = await createConversation.mutateAsync({ jobId, envoyId, hirerId: job.hirerId });
    if (convo?.id) router.push(`/messages/${convo.id}`);
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title={job?.title ?? "Job Details"} description={job?.description}>
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <p className="text-sm text-foreground-tertiary">Quick links</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/envoy/jobs" className="btn-secondary">Back to Jobs</Link>
            <Link href="/envoy/saved" className="btn-secondary">Saved Jobs</Link>
          </div>
        </div>
        {isLoading && <p className="text-foreground-secondary">Loading job...</p>}
        {error && <p className="text-destructive">Failed to load job.</p>}
        {job ? (
          <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
            <div className="text-sm text-foreground-tertiary">
              {job.locationType} - {job.location ?? "Remote"}
            </div>
            <div className="text-sm text-foreground-tertiary">
              Salary: ₦{job.salaryMin ?? 0} - ₦{job.salaryMax ?? 0}
            </div>
            <div className="text-sm text-foreground-tertiary">Status: {job.status}</div>
            <div className="flex flex-wrap gap-3">
              <button className="cta" onClick={handleApply}>Apply</button>
              {methods.map((method) => (
                <span key={method} className="text-xs px-2 py-1 rounded-lg bg-background-secondary text-foreground-secondary">
                  {CONTACT_LABELS[method]}
                </span>
              ))}
              <button className="btn-secondary" onClick={handleMessage}>Message Hirer</button>
            </div>
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
