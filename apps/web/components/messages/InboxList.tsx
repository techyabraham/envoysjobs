import Link from "next/link";

const conversations = [
  {
    id: "convo-1",
    name: "Helio Labs",
    job: "Senior Product Designer",
    lastMessage: "We would love to schedule a call.",
    updatedAt: "2h ago"
  },
  {
    id: "convo-2",
    name: "Pastor James",
    job: "Event Setup Assistant",
    lastMessage: "I honour you",
    updatedAt: "1d ago"
  }
];

export default function InboxList() {
  return (
    <div className="bg-white rounded-2xl border border-border">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Inbox</h3>
      </div>
      <div className="divide-y divide-border">
        {conversations.map((item) => (
          <Link
            key={item.id}
            href={`/messages/${item.id}`}
            className="block px-4 py-4 hover:bg-background-secondary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-foreground-secondary">{item.job}</p>
              </div>
              <span className="text-xs text-foreground-tertiary">{item.updatedAt}</span>
            </div>
            <p className="text-sm text-foreground-secondary mt-2">{item.lastMessage}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
