"use client";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Message } from "@/types/chat";
import { useSession } from "next-auth/react";

export default function ChatWindow({
  conversationId,
  setConversationId,
  messages,
  setMessages,
  onConversationCreated,
}: {
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onConversationCreated?: () => void;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-1 flex-col">
      <MessageList messages={messages} />
      <ChatInput
        messages={messages}
        setMessages={setMessages}
        session={session}
        conversationId={conversationId}
        setConversationId={setConversationId}
        onConversationCreated={onConversationCreated}
      />
    </div>
  );
}
