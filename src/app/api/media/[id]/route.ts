import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only ever unlink files inside our own uploads directory.
  if (media.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", media.url);
    await unlink(filePath).catch(() => {
      /* file may already be gone — non-fatal */
    });
  }

  await prisma.media.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
