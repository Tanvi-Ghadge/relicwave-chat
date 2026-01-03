"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50 p-4">
      {/* New Chat */}
      <button className="mb-4 rounded border px-3 py-2 text-sm hover:bg-gray-100">
        + New Chat
      </button>

      {/* Conversation list or hint */}
      <div className="flex-1 text-sm space-y-2">
        {session ? (
          <div className="rounded px-2 py-1 hover:bg-gray-100 cursor-pointer">
            Example conversation
          </div>
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
            onClick={() => signOut()}
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
