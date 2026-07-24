"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** 5×7 bitmap glyphs for hero wordmark characters */
const GLYPHS: Record<string, number[][]> = {
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  Q: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 1],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

type Dot = {
  id: string;
  cx: number;
  cy: number;
  delay: number;
};

type DotMatrixProps = {
  text: string;
  className?: string;
  /** Dot diameter in SVG units */
  radius?: number;
  /** Horizontal/vertical gap between dots */
  gap?: number;
  /** Columns between letters */
  letterGap?: number;
};

function buildDots(
  text: string,
  gap: number,
  letterGap: number
): { dots: Dot[]; width: number; height: number } {
  const dots: Dot[] = [];
  let cursorX = 0;
  const rows = 7;

  for (let li = 0; li < text.length; li++) {
    const char = text[li].toUpperCase();
    const glyph = GLYPHS[char] ?? GLYPHS[" "];
    const cols = glyph[0].length;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (glyph[y][x] !== 1) continue;
        dots.push({
          id: `${li}-${x}-${y}`,
          cx: cursorX + x * gap + gap / 2,
          cy: y * gap + gap / 2,
          delay: (li * 0.08) + (y + x) * 0.03 + Math.random() * 0.4,
        });
      }
    }

    cursorX += cols * gap + letterGap;
  }

  return {
    dots,
    width: Math.max(cursorX - letterGap, gap),
    height: rows * gap,
  };
}

export function DotMatrix({
  text,
  className,
  radius = 1.6,
  gap = 8,
  letterGap = 10,
}: DotMatrixProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Random flicker delays only after mount to avoid SSR/client mismatch
  const layout = useMemo(
    () => (mounted ? buildDots(text, gap, letterGap) : null),
    [mounted, text, gap, letterGap]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const width = text.length * (5 * gap + letterGap);
  const height = 7 * gap;

  return (
    <div className={cn("relative", className)} aria-hidden="true">
      <span className="sr-only">{text}</span>
      <svg
        viewBox={`0 0 ${layout?.width ?? width} ${layout?.height ?? height}`}
        className="h-full w-full overflow-visible"
        role="img"
      >
        {(layout?.dots ?? []).map((dot) =>
          reduceMotion ? (
            <circle
              key={dot.id}
              cx={dot.cx}
              cy={dot.cy}
              r={radius}
              fill="currentColor"
              opacity={0.85}
            />
          ) : (
            <motion.circle
              key={dot.id}
              cx={dot.cx}
              cy={dot.cy}
              r={radius}
              fill="currentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.25, 1, 0.55, 1] }}
              transition={{
                duration: 2.8,
                delay: dot.delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          )
        )}
      </svg>
    </div>
  );
}
