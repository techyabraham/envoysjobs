"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useConversations } from "@/lib/messaging";

export default function InboxList() {
  const { data: session } = useSession();
  const userId = (session as any)?.user?.id as string | undefined;
  const { data, isLoading, error } = useConversations(userId);

  return (
    <div className="bg-white rounded-2xl border border-border">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Inbox</h3>
      </div>
      {isLoading && <p className="px-4 py-4 text-foreground-secondary">Loading conversations...</p>}
      {error && <p className="px-4 py-4 text-destructive">Failed to load conversations.</p>}
      <div className="divide-y divide-border">
        {data?.map((item) => (
          <Link
            key={item.id}
            href={`/messages/${item.id}`}
            className="block px-4 py-4 hover:bg-background-secondary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Conversation</p>
                <p className="text-sm text-foreground-secondary">{item.job?.title ?? "Job"}</p>
              </div>
              <span className="text-xs text-foreground-tertiary">{item.messages?.[0]?.createdAt ?? ""}</span>
            </div>
            <p className="text-sm text-foreground-secondary mt-2">{item.messages?.[0]?.text ?? "No messages"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
