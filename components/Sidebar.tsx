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
                className={`group flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-150 ${
                  conversationId === conv.id 
                    ? "bg-gray-200 shadow-sm" 
                    : "hover:bg-gray-100"
                }`}
              >
                <div
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
                  className="flex-1 cursor-pointer truncate pr-2 text-sm"
                >
                  {conv.title || "Untitled conversation"}
                </div>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm("Are you sure you want to delete this conversation?")) {
                      try {
                        const res = await fetch(`/api/conversations/${conv.id}`, {
                          method: "DELETE",
                        });

                        if (res.ok) {
                          // Remove from local state
                          setConversations((prev) =>
                            prev.filter((c) => c.id !== conv.id)
                          );

                          // If this was the active conversation, clear it
                          if (conversationId === conv.id) {
                            setConversationId(null);
                            setMessages([]);
                          }
                        } else {
                          alert("Failed to delete conversation");
                        }
                      } catch (error) {
                        console.error("Error deleting conversation:", error);
                        alert("Failed to delete conversation");
                      }
                    }
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center w-6 h-6 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                  title="Delete conversation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
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
