import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ ok: true });
  }

  const { message, conversationId } = await req.json();

  let convId = conversationId;

  // ✅ CREATE CONVERSATION IF NONE EXISTS
  if (!convId) {
    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        title: message.slice(0, 40),
      },
    });

    convId = conversation.id;
  }

  // ✅ ALWAYS SAVE MESSAGE WITH VALID conversationId
  await prisma.message.create({
    data: {
      conversationId: convId,
      role: "user",
      content: message,
    },
  });

  return NextResponse.json({ conversationId: convId });
}
