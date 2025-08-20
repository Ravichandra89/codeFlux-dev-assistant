export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ensure Prisma runs in Node runtime

import { NextRequest, NextResponse } from "next/server";
import { RepositoryStatus } from "@prisma/client";
import { Indexer } from "@/services/indexer";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, branch } = body as { url: string; branch?: string };

    if (!url) throw new Error("URL is required");

    const name = url.split("/").slice(-2).join("/");

    const repository = await prisma.repository.create({
      data: { name, url, status: RepositoryStatus.LOADING },
    });

    // Run indexer asynchronously
    const indexer = new Indexer();
    indexer.run(repository.id, branch);

    return NextResponse.json({
      success: true,
      repository: { name, url, status: RepositoryStatus.LOADING },
    });
  } catch (e: unknown) {
    const error = e as { message: string; status?: number };
    console.error(error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 500 }
    );
  }
}

export async function GET() {
  try {
    const repositories = await prisma.repository.findMany();
    return NextResponse.json({ repositories });
  } catch (e: unknown) {
    const error = e as { message: string; status?: number };
    console.error(error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 500 }
    );
  }
}
