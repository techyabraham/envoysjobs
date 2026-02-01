"use client";

import { useMemo } from "react";
import { defaultQuickReplies, isHonourMessage } from "../../lib/autoMessages";

const mockMessages = [
  { id: "m1", sender: "Helio Labs", text: "I honour you", mine: false },
  { id: "m2", sender: "You", text: "Thank you, I appreciate it", mine: true }
];

export default function ConversationView() {
  const lastReceived = mockMessages.findLast((m) => !m.mine);

  const quickReplies = useMemo(() => {
    if (lastReceived && isHonourMessage(lastReceived.text)) {
      return ["you are amazing", ...defaultQuickReplies];
    }
    return [
      "Hello, I’m interested in this opportunity",
      "Thank you for reaching out",
      "I’m available to proceed"
    ];
  }, [lastReceived]);

  return (
    <div className="bg-white rounded-2xl border border-border flex flex-col h-[600px]">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Senior Product Designer · Helio Labs</h3>
        <p className="text-sm text-foreground-secondary">Context: Job inquiry</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
              message.mine
                ? "ml-auto bg-deep-blue text-white"
                : "bg-background-secondary text-foreground"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              className="px-3 py-2 rounded-full border border-border text-sm hover:bg-background-secondary transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-3 py-2 border border-border rounded-lg"
            placeholder="Write a message..."
          />
          <button className="px-4 py-2 rounded-lg bg-emerald-green text-white">Send</button>
        </div>
      </div>
    </div>
  );
}
