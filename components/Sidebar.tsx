"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type Conversation = {
  id: string;
  title: string | null;
};

type SidebarProps = {
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  setMessages: (messages: any[]) => void;
};

export default function Sidebar({
  conversationId,
  setConversationId,
  setMessages,
}: SidebarProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const previousConversationId = useRef<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!session) {
      setConversations([]);
      return;
    }

    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data);
    } catch {
      setConversations([]);
    }
  }, [session]);

  // Fetch conversations when logged in
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Refetch when a new conversation is created (conversationId changes from null to a string)
  useEffect(() => {
    const wasNull = previousConversationId.current === null;
    const isNowSet = conversationId !== null;
    
    // Only refetch if we transitioned from null to a value (new conversation created)
    if (wasNull && isNowSet && session) {
      fetchConversations();
    }
    
    previousConversationId.current = conversationId;
  }, [conversationId, session, fetchConversations]);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50 p-4">
      {/* New Chat */}
      <button
        className="mb-4 rounded border px-3 py-2 text-sm hover:bg-gray-100"
        onClick={() => {
          setConversationId(null);
          setMessages([]);
        }}
      >
        + New Chat
      </button>

      {/* Conversation list or hint */}
      <div className="flex-1 space-y-2 text-sm overflow-y-auto">
        {session ? (
          conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={async () => {
                    setMessages([]);
                  setConversationId(conv.id);

                  const res = await fetch(
                    `/api/conversations/${conv.id}`
                  );
                  const data = await res.json();

                  setMessages(
                    data.map((m: any) => ({
                      id: m.id,
                      role: m.role,
                      content: m.content,
                    }))
                  );
                }}
                className={`cursor-pointer rounded px-2 py-1 hover:bg-gray-100 ${
                    conversationId === conv.id ? "bg-gray-200" : ""
                  }`}
              >
                {conv.title || "Untitled conversation"}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No conversations yet</p>
          )
        ) : (
          <p className="text-xs text-gray-500">
            Sign in to save your chats
          </p>
        )}
      </div>

      {/* Auth button (bottom-left) */}
      <div className="pt-4">
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full rounded bg-black px-3 py-2 text-sm text-white"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}
