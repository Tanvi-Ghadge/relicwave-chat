"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { Message } from "@/types/chat";

export default function ChatLayout() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        conversationId={conversationId}
        setConversationId={setConversationId}
        setMessages={setMessages}
      />
      <ChatWindow
        conversationId={conversationId}
        setConversationId={setConversationId}
        messages={messages}
        setMessages={setMessages}
        onConversationCreated={() => {
          // This will trigger Sidebar to refetch via conversationId change
        }}
      />
    </div>
  );
}
