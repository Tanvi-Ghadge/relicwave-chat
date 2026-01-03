"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
