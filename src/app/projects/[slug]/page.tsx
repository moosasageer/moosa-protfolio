import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { splitTech } from "@/lib/utils";

type Props = { params: { slug: string } };

async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { order: "asc" } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return {};
  return {
    title: project.metaTitle || `${project.title} — Moosa Sageer`,
    description: project.metaDescription || project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.metaTitle || project.title,
      description: project.metaDescription || project.shortDescription,
      images: project.ogImageUrl || project.coverImageUrl ? [project.ogImageUrl || project.coverImageUrl!] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-mist-500 hover:text-mist-200 transition-colors mb-8">
            <ArrowLeft size={15} /> Back to projects
          </Link>

          <p className="section-label mb-3">{project.category}</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-mist-100 text-balance">{project.title}</h1>
          <p className="mt-4 text-lg text-mist-400 text-balance">{project.shortDescription}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {splitTech(project.technologies).map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs font-mono text-mist-400">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-white hover:bg-signal-soft transition-colors">
                Live Demo <ArrowUpRight size={15} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-mist-200 hover:bg-white/5 transition-colors">
                <Github size={15} /> Source
              </a>
            )}
          </div>

          {project.coverImageUrl && (
            <div className="relative mt-12 aspect-video rounded-3xl overflow-hidden border border-white/8">
              <Image src={project.coverImageUrl} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 896px" className="object-cover" priority />
            </div>
          )}

          <div className="mt-12 prose prose-invert max-w-none">
            <p className="text-mist-300 leading-relaxed whitespace-pre-line text-lg">{project.fullDescription}</p>
          </div>

          {project.images.length > 0 && (
            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              {project.images.map((img) => (
                <div key={img.id} className="relative aspect-video rounded-2xl overflow-hidden border border-white/8">
                  <Image src={img.url} alt={img.alt || project.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer text={settings?.footerText || "Designed & built by Moosa Sageer."} />
    </>
  );
}
