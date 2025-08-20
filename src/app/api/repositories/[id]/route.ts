export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repositories = await prisma.repository.delete({
      where: { id: params.id },
    });

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
