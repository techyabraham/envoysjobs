import PageShell from "@/components/PageShell";
import InboxList from "@/components/messages/InboxList";

export default function Page() {
  return (
    <PageShell title="Messages" description="Your conversations with Envoys and Hirers.">
      <InboxList />
    </PageShell>
  );
}
