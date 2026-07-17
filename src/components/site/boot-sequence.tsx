"use client";

import { useEffect, useMemo, useState } from "react";

import { atmosphere } from "@/config/atmosphere";

type BootSequenceProps = {
  onComplete: () => void;
};

const STEP_MS = 240;
const COMPLETE_DELAY_MS = 700;

export function BootSequence({ onComplete }: BootSequenceProps) {
  const lines = useMemo(() => atmosphere.bootLines, []);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= lines.length) {
      const timeoutId = window.setTimeout(onComplete, COMPLETE_DELAY_MS);
      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleCount((currentCount) => currentCount + 1);
    }, STEP_MS);

    return () => window.clearTimeout(timeoutId);
  }, [lines.length, onComplete, visibleCount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020404]/95 px-6">
      <div className="terminal-card liquid-panel w-full max-w-3xl p-6 text-[0.82rem] text-[#a7ffcf] shadow-[0_0_60px_rgba(74,255,173,0.12)]">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2 text-[0.72rem] uppercase tracking-[0.32em] text-[#79d9aa]">
          <span>Das.web / boot</span>
          <span>{String(visibleCount).padStart(2, "0")}</span>
        </div>
        <div className="space-y-2 font-mono">
          {lines.slice(0, visibleCount).map((line) => (
            <p key={line} className="animate-[fade-in_280ms_ease_forwards] opacity-0">
              {line}
            </p>
          ))}
          {visibleCount < lines.length ? (
            <p className="text-[#d9ffe9]">
              <span className="mr-2 text-[#6dffb0]">&gt;</span>
              initializing
              <span className="ml-1 inline-block animate-pulse">_</span>
            </p>
          ) : (
            <p className="text-[#d9ffe9]">
              <span className="mr-2 text-[#6dffb0]">&gt;</span>
              ready
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
