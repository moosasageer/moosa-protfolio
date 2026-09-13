import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { projectSchema } from "@/lib/validation";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);

  // Lightweight actions (toggle publish, reorder) skip full-schema validation.
  if (json?.action === "toggle-published") {
    const current = await prisma.project.findUnique({ where: { id: params.id } });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await prisma.project.update({
      where: { id: params.id },
      data: { published: !current.published },
    });
    return NextResponse.json(updated);
  }

  if (json?.action === "duplicate") {
    const original = await prisma.project.findUnique({ where: { id: params.id }, include: { images: true } });
    if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const copy = await prisma.project.create({
      data: {
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        shortDescription: original.shortDescription,
        fullDescription: original.fullDescription,
        coverImageUrl: original.coverImageUrl,
        technologies: original.technologies,
        githubUrl: original.githubUrl,
        liveUrl: original.liveUrl,
        category: original.category,
        featured: false,
        published: false,
        order: original.order,
      },
    });
    return NextResponse.json(copy, { status: 201 });
  }

  const parsed = projectSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { images, ...data } = parsed.data;
  const project = await prisma.project.update({ where: { id: params.id }, data });

  if (images) {
    await prisma.projectImage.deleteMany({ where: { projectId: params.id } });
    if (images.length) {
      await prisma.projectImage.createMany({
        data: images.map((img, i) => ({ ...img, order: i, projectId: params.id })),
      });
    }
  }

  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
