import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();

  return (
    <div>
      <PageHeader title="Edit Project" description={project.title} />
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          shortDescription: project.shortDescription,
          fullDescription: project.fullDescription,
          coverImageUrl: project.coverImageUrl || "",
          technologies: project.technologies,
          githubUrl: project.githubUrl || "",
          liveUrl: project.liveUrl || "",
          category: project.category,
          featured: project.featured,
          published: project.published,
          order: project.order,
          metaTitle: project.metaTitle || "",
          metaDescription: project.metaDescription || "",
          images: project.images.map((i) => ({ url: i.url, alt: i.alt })),
        }}
      />
    </div>
  );
}
