import { NextRequest } from "next/server";
import { Message as VercelChatMessage } from "ai";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Document, PrismaClient, Prisma } from "@prisma/client";

const formatMessage = (message: VercelChatMessage) => ({
  role: message.role,
  content: message.content,
});

// Define type for Gemini response block
type GeminiBlock = { text?: string } | string;

// Define type for retrieved document from PrismaVectorStore
type RetrievedDocument = { pageContent: string };

// Helper to safely extract text from Gemini response
function extractText(message: { content: string | GeminiBlock[] }): string {
  if (typeof message.content === "string") return message.content;

  return message.content
    .map((block: GeminiBlock) => {
      if (typeof block === "string") return block;
      if ("text" in block && block.text) return block.text;
      return JSON.stringify(block);
    })
    .join("\n");
}

export async function POST(req: NextRequest) {
  const db = new PrismaClient();

  try {
    const body = await req.json();
    const messages: VercelChatMessage[] = body.messages ?? [];
    const repositoryId: string = body.selectedRepoId;

    if (!messages.length) {
      return new Response("No messages provided", { status: 400 });
    }

    const repository = await db.repository.findUnique({
      where: { id: repositoryId },
    });
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) throw new Error("Google API key is required");
    if (!repository) throw new Error("Repository not found");

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "embedding-001",
      apiKey,
    });

    const vectorStore = PrismaVectorStore.withModel<Document>(db).create(
      embeddings,
      {
        prisma: Prisma,
        tableName: "Document",
        vectorColumnName: "vector",
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
        },
        filter: { namespaceId: { equals: repository.id } },
      }
    );

    const retriever = vectorStore.asRetriever({
      k: 6,
      searchType: "similarity",
    });

    const contextDocs: RetrievedDocument[] =
      await retriever.getRelevantDocuments(
        messages[messages.length - 1].content
      );

    const context = contextDocs.map((d) => d.pageContent).join("\n\n");

    const chatMessages = [
      {
        role: "system",
        content: `You are a helpful coding assistant. Use the following context:\n\n${context}`,
      },
      ...messages.map(formatMessage),
    ];

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0,
      apiKey,
    });

    const response = await llm.call(chatMessages);

    const textOutput = extractText(
      response as { content: string | GeminiBlock[] }
    );

    return new Response(textOutput, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    console.error("Chat error:", err);
    return new Response((err as Error).message || "Unknown error", {
      status: 500,
    });
  } finally {
    await db.$disconnect();
  }
}
