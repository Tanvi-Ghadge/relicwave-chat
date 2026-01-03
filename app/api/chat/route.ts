import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user?.id;

  const { message, conversationId } = await req.json();

  let convId = conversationId;
  let chatHistory: Array<{ role: string; message: string }> = [];

  // ✅ ONLY CREATE CONVERSATION AND SAVE MESSAGES IF AUTHENTICATED
  if (isAuthenticated) {
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

    // ✅ SAVE USER MESSAGE
    await prisma.message.create({
      data: {
        conversationId: convId,
        role: "user",
        content: message,
      },
    });

    // ✅ GET CONVERSATION HISTORY
    const previousMessages = await prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "asc" },
    });

    chatHistory = previousMessages
      .slice(0, -1)
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "chatbot",
        message: m.content,
      }));
  }

  // ✅ STREAM COHERE RESPONSE (works for both authenticated and unauthenticated)
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullResponse = "";

      try {
        // Send conversationId only if authenticated
        if (isAuthenticated && convId) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ conversationId: convId })}\n\n`)
          );
        }

        const chatStream = await cohere.chatStream({
          message,
          chatHistory: chatHistory as any,
          model: "command-r-plus-08-2024",
        });

        for await (const event of chatStream) {
          if (event.eventType === "text-generation") {
            const chunk = event.text;
            fullResponse += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
            );
          }
        }

        // ✅ SAVE AI MESSAGE TO DATABASE ONLY IF AUTHENTICATED
        if (isAuthenticated && convId) {
          await prisma.message.create({
            data: {
              conversationId: convId,
              role: "assistant",
              content: fullResponse,
            },
          });
        }

        controller.close();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
