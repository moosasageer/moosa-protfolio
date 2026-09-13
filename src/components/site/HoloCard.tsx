"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export default function HoloCard({
  avatarUrl,
  name,
}: {
  avatarUrl?: string | null;
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 160, damping: 18 });
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const sheenBackground = useTransform([glowX, glowY], (latest) => {
    const [gx, gy] = latest as number[];
    return `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), transparent 55%)`;
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-56 w-44 md:h-72 md:w-56"
      >
        <div className="absolute -inset-[3px] rounded-[28px] holo-border" />

        <div className="relative h-full w-full rounded-[26px] overflow-hidden ring-1 ring-white/15 bg-ink-800">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 176px, 224px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-5xl text-mist-400">
              {name.charAt(0)}
            </div>
          )}

          <motion.div
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{ background: sheenBackground }}
          />
          <div className="pointer-events-none absolute inset-0 holo-sheen opacity-40 mix-blend-color-dodge" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}