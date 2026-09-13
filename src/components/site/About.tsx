import Reveal from "./Reveal";

type Stat = { id: string; value: string; label: string };

export default function About({
  heading,
  bio,
  location,
  jobTitle,
  stats,
}: {
  heading: string;
  bio: string;
  location: string;
  jobTitle: string;
  stats: Stat[];
}) {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <p className="section-label mb-4">01 — About</p>
        </Reveal>
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-14">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-mist-100 text-balance">
              {heading}
            </h2>
            <p className="mt-7 text-mist-400 leading-relaxed text-lg text-balance">{bio}</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-mist-500 font-mono">
              <span>{jobTitle}</span>
              <span className="text-signal-soft">•</span>
              <span>{location}</span>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 h-full flex flex-col justify-between min-h-[140px]">
                  <span className="font-display text-3xl md:text-4xl text-signal-soft">{s.value}</span>
                  <span className="mt-3 text-sm text-mist-500">{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
