import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { projectSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: true },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const existingSlug = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existingSlug) {
    return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
  }

  const { images, ...data } = parsed.data;
  const project = await prisma.project.create({
    data: {
      ...data,
      images: images?.length ? { create: images.map((img, i) => ({ ...img, order: i })) } : undefined,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
