import Reveal from "./Reveal";
import { formatDate, splitTech } from "@/lib/utils";

type ExperienceItem = {
  id: string;
  position: string;
  organization: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string | null;
  current: boolean;
  technologies: string;
};

export default function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Reveal>
          <p className="section-label mb-4">04 — Journey</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-mist-100 mb-14">
            Where the time went.
          </h2>
        </Reveal>

        <div className="relative border-l border-white/10 pl-8 space-y-12">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <div className="relative">
                <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full bg-signal ring-4 ring-signal/20" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl text-mist-100">{item.position}</h3>
                  <span className="font-mono text-xs text-mist-500">
                    {formatDate(item.startDate)} — {item.current ? "Present" : formatDate(item.endDate)}
                  </span>
                </div>
                <p className="text-signal-soft text-sm mt-1">{item.organization}</p>
                <p className="mt-3 text-mist-400 leading-relaxed">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {splitTech(item.technologies).map((t) => (
                    <span key={t} className="rounded-full border border-white/8 px-2.5 py-1 text-[11px] font-mono text-mist-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
