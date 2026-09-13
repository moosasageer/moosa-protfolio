import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { profileSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const profile = await prisma.profile.findUnique({
    where: { id: "profile" },
    include: {
      stats: { orderBy: { order: "asc" } },
      socialLinks: { orderBy: { order: "asc" } },
    },
  });
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { stats, socialLinks, ...data } = parsed.data;

  const profile = await prisma.profile.update({ where: { id: "profile" }, data });

  if (stats) {
    await prisma.stat.deleteMany({ where: { profileId: "profile" } });
    if (stats.length) {
      await prisma.stat.createMany({
        data: stats.map((s, i) => ({ ...s, order: s.order ?? i, profileId: "profile" })),
      });
    }
  }

  if (socialLinks) {
    await prisma.socialLink.deleteMany({ where: { profileId: "profile" } });
    if (socialLinks.length) {
      await prisma.socialLink.createMany({
        data: socialLinks.map((s, i) => ({ ...s, order: s.order ?? i, profileId: "profile" })),
      });
    }
  }

  return NextResponse.json(profile);
}
