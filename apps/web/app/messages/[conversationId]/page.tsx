import PageShell from "@/components/PageShell";
import ConversationView from "@/components/messages/ConversationView";

export default function Page() {
  return (
    <PageShell title="Conversation" description="Continue your chat.">
      <ConversationView />
    </PageShell>
  );
}
