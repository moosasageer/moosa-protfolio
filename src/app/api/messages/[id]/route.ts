import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const read = typeof json?.read === "boolean" ? json.read : true;

  const message = await prisma.message.update({ where: { id: params.id }, data: { read } });
  return NextResponse.json(message);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.message.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
