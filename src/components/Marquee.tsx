"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

/** Continuous ticker strip — duplicated track for a seamless loop */
export function Marquee({ items, className }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const track = [...items, ...items];

  return (
    <div
      className={cn(
        "relative flex overflow-hidden border-y border-neutral-900 bg-neutral-950/40 py-4",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 font-mono text-xs tracking-[0.2em] text-neutral-500",
          !reduceMotion && "marquee-track"
        )}
      >
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            {item}
            <span className="text-orange-500/70">+</span>
          </span>
        ))}
      </div>
    </div>
  );
}
