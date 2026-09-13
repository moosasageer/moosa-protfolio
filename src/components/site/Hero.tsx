"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import TerminalChip from "./TerminalChip";
import { getSocialIcon } from "@/lib/icons";

type SocialLink = { label: string; url: string; icon: string };

type Props = {
  greeting: string;
  subtitle: string;
  statement: string;
  avatarUrl?: string | null;
  name: string;
  currentlyBuilding: string;
  socialLinks?: SocialLink[];
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({
  greeting,
  subtitle,
  statement,
  avatarUrl,
  name,
  currentlyBuilding,
  socialLinks = [],
}: Props) {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-radial-fade" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-signal/20 blur-[120px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-32 h-[320px] w-[320px] rounded-full bg-signal-amber/10 blur-[110px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pt-28 pb-20">
        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <motion.p variants={item} className="section-label mb-5">
              {subtitle}
            </motion.p>

            <motion.h1
              variants={item}
              className="font-display text-balance text-[13vw] leading-[0.95] md:text-[6.2vw] font-medium tracking-tight text-mist-100"
            >
              {greeting}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-7 max-w-xl text-lg md:text-xl text-mist-400 leading-relaxed text-balance"
            >
              {statement}
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition-all hover:bg-signal-soft glow"
              >
                View My Work
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-mist-200 transition-colors hover:bg-white/5"
              >
                Let&rsquo;s Talk
              </a>
            </motion.div>
          </div>

          <motion.div variants={item} className="justify-self-center md:justify-self-end">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-full border border-dashed border-white/10"
              />
              <div className="h-40 w-40 md:h-56 md:w-56 rounded-full overflow-hidden ring-1 ring-white/10 glow bg-ink-700 relative">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={name} fill sizes="(max-width: 768px) 160px, 224px" className="object-cover" priority />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-4xl text-mist-400">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-5 flex justify-center gap-2.5">
                {socialLinks.map((link, i) => {
                  const Icon = getSocialIcon(link.icon);
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-mist-300 transition-colors hover:border-signal/50 hover:text-signal-soft hover:bg-white/[0.06]"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 md:mt-20"
        >
          <TerminalChip content={currentlyBuilding} />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-mist-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={18} />
      </motion.a>
    </section>
  );
}
