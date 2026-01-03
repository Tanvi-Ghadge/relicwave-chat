"use client";

import { useState } from "react";

export default function ChatInput() {
  const [value, setValue] = useState("");

  return (
    <div className="border-t p-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Send a message..."
        className="w-full rounded border px-4 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}
