import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // FIX

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId: id,
      conversation: {
        userId: session.user.id, // ownership check
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}
