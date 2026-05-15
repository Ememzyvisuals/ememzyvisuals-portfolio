// app/api/chat/route.ts
import { NextRequest } from "next/server";
import { groq, streamChat } from "@/lib/groq";
import { knowledgeChunks } from "@/data/contextChunks";

export const runtime = "nodejs";
export const maxDuration = 30;

// Simple keyword-based retrieval (fallback when pgvector not available)
function retrieveContext(query: string): string {
  const q = query.toLowerCase();

  const scored = knowledgeChunks.map((chunk) => {
    const words = q.split(/\s+/);
    const score = words.reduce((acc, word) => {
      return acc + (chunk.content.toLowerCase().includes(word) ? 1 : 0);
    }, 0);
    return { chunk, score };
  });

  const topChunks = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .filter((c) => c.score > 0)
    .map((c) => c.chunk.content);

  // Always include bio
  const bioChunks = knowledgeChunks
    .filter((c) => c.source === "bio")
    .map((c) => c.content);

  const all = [...new Set([...bioChunks, ...topChunks])];
  return all.join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages", { status: 400 });
    }

    // Get the latest user message for context retrieval
    const latestUserMessage = [...messages]
      .reverse()
      .find((m: { role: string }) => m.role === "user");

    const context = retrieveContext(latestUserMessage?.content ?? "");

    // Create streaming completion
    const stream = await streamChat(messages, context);

    // Convert to ReadableStream and return
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk);
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
