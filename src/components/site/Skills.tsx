"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getIcon } from "@/lib/icons";
import Reveal from "./Reveal";

type SkillItem = { id: string; name: string; category: string; icon: string };

const CATEGORY_LABELS: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  PROGRAMMING: "Programming",
  AI_ML: "AI / Machine Learning",
  DATABASE: "Database",
  TOOLS: "Tools",
};

export default function Skills({ skills }: { skills: SkillItem[] }) {
  const categories = useMemo(() => {
    const set = Array.from(new Set(skills.map((s) => s.category)));
    return ["ALL", ...set];
  }, [skills]);
  const [active, setActive] = useState("ALL");

  const visible = active === "ALL" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <p className="section-label mb-4">02 — Skills</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-mist-100 mb-10">
            Tools of the trade.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-4 py-2 text-xs font-mono tracking-wide transition-colors border ${
                  active === c
                    ? "bg-signal/15 border-signal/40 text-signal-soft"
                    : "border-white/10 text-mist-500 hover:text-mist-200 hover:border-white/20"
                }`}
              >
                {c === "ALL" ? "All" : CATEGORY_LABELS[c] || c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {visible.map((skill, i) => {
              const Icon = getIcon(skill.icon);
              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-mist-300 transition-all hover:border-signal/40 hover:bg-signal/[0.06] hover:text-mist-100 hover:shadow-[0_0_24px_-6px_rgba(110,86,207,0.5)]"
                >
                  <Icon size={16} className="text-signal-soft" />
                  {skill.name}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
