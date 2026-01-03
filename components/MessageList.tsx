"use client";

import { Message } from "@/types/chat";

export default function MessageList({
  messages,
}: {
  messages: Message[];
}) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-6">
      {messages.length === 0 && (
        <div className="text-sm text-gray-500">
          Start a conversation…
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-xl rounded p-3 text-sm ${
            msg.role === "user"
              ? "ml-auto bg-blue-500 text-white"
              : "bg-gray-100"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
