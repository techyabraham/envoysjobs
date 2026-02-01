import PageShell from "@/components/PageShell";
import ConversationView from "@/components/messages/ConversationView";

export default function Page() {
  return (
    <PageShell title="Conversation" description="Reply quickly with suggested responses.">
      <ConversationView />
    </PageShell>
  );
}
