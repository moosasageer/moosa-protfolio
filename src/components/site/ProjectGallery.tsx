"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = { url: string; alt?: string | null };

export default function ProjectGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next, images.length]);

  if (images.length === 0) return null;

  return (
    <div className="mt-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div
        className="relative aspect-video rounded-3xl overflow-hidden border border-white/8 bg-ink-800"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[index].url}
              alt={images[index].alt || title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </motion.div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-signal" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border transition-all ${
                i === index ? "border-signal opacity-100" : "border-white/10 opacity-60 hover:opacity-90"
              }`}
            >
              <Image src={img.url} alt={img.alt || title} fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}