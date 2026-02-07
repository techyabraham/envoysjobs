"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { defaultQuickReplies, isHonourMessage } from "@/lib/autoMessages";
import { useConversationMessages, useSendMessage } from "@/lib/messaging";

export default function ConversationView() {
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const { data: session } = useSession();
  const userId = (session as any)?.user?.id as string | undefined;
  const { data: messages, isLoading } = useConversationMessages(conversationId);
  const sendMessage = useSendMessage();
  const [text, setText] = useState("");

  const lastReceived = messages?.slice().reverse().find((m) => m.senderId !== userId);

  const quickReplies = useMemo(() => {
    if (lastReceived && isHonourMessage(lastReceived.text)) {
      return ["you are amazing", ...defaultQuickReplies];
    }
    return [
      "Hello, I?m interested in this opportunity",
      "Thank you for reaching out",
      "I?m available to proceed"
    ];
  }, [lastReceived]);

  const handleSend = async (value: string) => {
    if (!conversationId || !userId || !value.trim()) return;
    await sendMessage.mutateAsync({ conversationId, text: value.trim() });
    setText("");
  };

  return (
    <div className="bg-white rounded-2xl border border-border flex flex-col h-[600px]">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Conversation</h3>
        <p className="text-sm text-foreground-secondary">Context: Job inquiry</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && <p className="text-foreground-secondary">Loading messages...</p>}
        {messages?.map((message) => {
          const mine = message.senderId === userId;
          return (
            <div
              key={message.id}
              className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                mine ? "ml-auto bg-deep-blue text-white" : "bg-background-secondary text-foreground"
              }`}
            >
              {message.text}
            </div>
          );
        })}
      </div>
      <div className="px-4 py-3 border-t border-border space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              className="px-3 py-2 rounded-full border border-border text-sm hover:bg-background-secondary transition-colors"
              onClick={() => handleSend(reply)}
            >
              {reply}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-3 py-2 border border-border rounded-lg"
            placeholder="Write a message..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <button className="px-4 py-2 rounded-lg bg-emerald-green text-white" onClick={() => handleSend(text)}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
