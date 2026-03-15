"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import InboxList from "@/components/messages/InboxList";

export default function Page() {
  return (
    <DashboardShell>
      <PageShell title="Messages" description="Your conversations with Envoys and Hirers.">
        <InboxList />
      </PageShell>
    </DashboardShell>
  );
}
