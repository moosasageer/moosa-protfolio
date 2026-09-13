import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { skillSchema } from "@/lib/validation";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);

  if (json?.action === "toggle-active") {
    const current = await prisma.skill.findUnique({ where: { id: params.id } });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await prisma.skill.update({ where: { id: params.id }, data: { active: !current.active } });
    return NextResponse.json(updated);
  }

  const parsed = skillSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const skill = await prisma.skill.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(skill);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.skill.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
