"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import ConversationView from "@/components/messages/ConversationView";

export default function Page() {
  return (
    <DashboardShell>
      <PageShell title="Conversation" description="Continue your discussion with Envoys and Hirers.">
        <ConversationView />
      </PageShell>
    </DashboardShell>
  );
}
