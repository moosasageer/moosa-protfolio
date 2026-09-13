import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const settings = await prisma.siteSettings.update({ where: { id: "settings" }, data: parsed.data });
  return NextResponse.json(settings);
}
