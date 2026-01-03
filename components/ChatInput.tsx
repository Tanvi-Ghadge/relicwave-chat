"use client";

import { useState } from "react";
import { Message } from "@/types/chat";

export default function ChatInput({
  messages,
  setMessages,
  session,
  conversationId,
  setConversationId,
  onConversationCreated,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  session: any;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  onConversationCreated?: () => void;
}) {
  const [value, setValue] = useState("");

  const handleSend = async () => {
    if (!value.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: value,
    };

    // 1️⃣ Optimistic UI update
    setMessages((prev) => [...prev, userMessage]);
    setValue("");

    // 2️⃣ Persist to DB if logged in
    if (session) {
      const wasNewConversation = !conversationId;
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId, // 🔑 ONLY this decides new vs existing chat
        }),
      });

      const data = await res.json();

      // 🔑 ALWAYS trust backend response
      setConversationId(data.conversationId);

      // 🔄 If a new conversation was created, trigger sidebar refresh
      if (wasNewConversation && onConversationCreated) {
        onConversationCreated();
      }
    }

    // 3️⃣ Placeholder AI reply
    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "AI response placeholder",
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div className="border-t p-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Send a message..."
        className="w-full rounded border px-4 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}
