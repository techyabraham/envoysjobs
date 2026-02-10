"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { defaultQuickReplies, isHonourMessage } from "@/lib/autoMessages";
import { useConversationMessages, useSendAttachment, useSendMessage } from "@/lib/messaging";
import { API_BASE_URL } from "@/lib/api";

export default function ConversationView() {
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const { data: session } = useSession();
  const userId = (session as any)?.user?.id as string | undefined;
  const { data: messages, isLoading } = useConversationMessages(conversationId);
  const sendMessage = useSendMessage();
  const sendAttachment = useSendAttachment();
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const lastReceived = messages?.slice().reverse().find((m) => m.senderId !== userId);

  const quickReplies = useMemo(() => {
    if (lastReceived && isHonourMessage(lastReceived.text)) {
      return ["you are amazing", ...defaultQuickReplies];
    }
    return [
      "Hello, I'm interested in this opportunity",
      "Thank you for reaching out",
      "I'm available to proceed"
    ];
  }, [lastReceived]);

  const handleSend = async (value: string) => {
    if (!conversationId || !userId || !value.trim()) return;
    await sendMessage.mutateAsync({ conversationId, text: value.trim() });
    setText("");
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !conversationId || !userId) return;
    await sendAttachment.mutateAsync({ conversationId, file });
    event.target.value = "";
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
              {message.attachments?.length ? (
                <div className={`mt-2 text-xs ${mine ? "text-white/80" : "text-foreground-secondary"}`}>
                  {message.attachments.map((attachment) => (
                    <a
                      key={attachment.url}
                      href={`${API_BASE_URL}${attachment.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {attachment.type}
                    </a>
                  ))}
                </div>
              ) : null}
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
          <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />
          <button
            className="px-3 py-2 rounded-lg border border-border text-sm"
            onClick={() => fileRef.current?.click()}
            type="button"
          >
            Attach
          </button>
          <button className="px-4 py-2 rounded-lg bg-emerald-green text-white" onClick={() => handleSend(text)}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
