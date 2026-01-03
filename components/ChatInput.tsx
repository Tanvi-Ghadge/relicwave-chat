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
    const messageValue = value;
    setValue("");

    // 2️⃣ Create placeholder AI message for streaming
    const aiMessageId = crypto.randomUUID();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, aiMessage]);

    // 3️⃣ Stream AI response (works for both signed in and signed out)
    const wasNewConversation = !conversationId;
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageValue,
          conversationId: session ? conversationId : null, // Only send conversationId if signed in
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.chunk) {
                fullResponse += data.chunk;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: fullResponse }
                      : msg
                  )
                );
              }
              
              // Only handle conversationId if signed in
              if (session && data.conversationId) {
                setConversationId(data.conversationId);
                if (wasNewConversation && onConversationCreated) {
                  onConversationCreated();
                }
              }
              
              if (data.error) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: data.error }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing stream data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: "Error: Failed to get AI response. Please try again." }
            : msg
        )
      );
    }
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
