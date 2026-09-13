import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";

type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string | null;
  technologies: string;
  featured: boolean;
};

export default function Projects({ projects }: { projects: ProjectItem[] }) {
  return (
    <section id="projects" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <p className="section-label mb-4">03 — Work</p>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <h2 className="font-display text-4xl md:text-5xl font-medium text-mist-100">Selected work.</h2>
          </div>
        </Reveal>

        {projects.length === 0 ? (
          <p className="text-mist-500">Projects will appear here once published from the admin dashboard.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} delay={i * 0.08} {...p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
