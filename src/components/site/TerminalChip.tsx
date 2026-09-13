"use client";

import { useEffect, useState } from "react";

export default function TerminalChip({ content }: { content: string }) {
  const lines = content.split("\n").filter(Boolean);
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    if (lines.length === 0) return;
    const current = lines[lineIndex] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 45);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1100);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 500);
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 22);
      } else {
        setLineIndex((i) => (i + 1) % lines.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, phase]);

  if (lines.length === 0) return null;

  return (
    <div className="glass max-w-md rounded-2xl px-5 py-4 font-mono text-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-mist-500 text-xs">currently-building.sh</span>
      </div>
      <p className="text-signal-soft">
        <span className="text-mist-500">$</span> currently building...
      </p>
      <p className="mt-1 text-mist-200 min-h-[1.4em]">
        {text}
        <span className="inline-block w-[7px] h-[1em] bg-signal-soft ml-0.5 align-middle animate-blink" />
      </p>
    </div>
  );
}
