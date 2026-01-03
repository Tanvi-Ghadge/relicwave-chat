"use client";

export default function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-6">
      {/* AI message */}
      <div className="max-w-xl rounded bg-gray-100 p-3 text-sm">
        Hi! You can start chatting without signing in.
      </div>

      {/* User message */}
      <div className="ml-auto max-w-xl rounded bg-blue-500 p-3 text-sm text-white">
        That’s nice.
      </div>
    </div>
  );
}
