"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { splitTech } from "@/lib/utils";
import Reveal from "./Reveal";

type Props = {
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl?: string | null;
  technologies: string;
  featured?: boolean;
  delay?: number;
};

export default function ProjectCard({ title, slug, shortDescription, coverImageUrl, technologies, featured, delay = 0 }: Props) {
  const tech = splitTech(technologies).slice(0, 4);

  return (
    <Reveal delay={delay}>
      <Link href={`/projects/${slug}`} className="group block">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-ink-800">
          <div className="relative aspect-[16/10] overflow-hidden">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center">
                <span className="font-display text-2xl text-mist-500">{title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
            {featured && (
              <span className="absolute top-4 left-4 rounded-full bg-signal-amber/15 border border-signal-amber/30 px-3 py-1 text-[11px] font-mono text-signal-amber">
                Featured
              </span>
            )}
            <div className="absolute top-4 right-4 h-9 w-9 rounded-full glass flex items-center justify-center opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <ArrowUpRight size={16} className="text-mist-100" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-display text-xl text-mist-100 group-hover:text-signal-soft transition-colors">
              {title}
            </h3>
            <p className="mt-2 text-sm text-mist-500 leading-relaxed line-clamp-2">{shortDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tech.map((t) => (
                <span key={t} className="rounded-full border border-white/8 px-2.5 py-1 text-[11px] font-mono text-mist-500">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
