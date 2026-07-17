"use client";

import { useEffect, useState } from "react";

import { atmosphere } from "@/config/atmosphere";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/capability";

const ASCII_SWAP = ["*", "+", ".", ":", "#"];

export function AsciiSignal({ className }: { className?: string }) {
  const [tick, setTick] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTick((currentTick) => currentTick + 1);
    }, 900);

    return () => window.clearInterval(intervalId);
  }, [reducedMotion]);

  const rows = atmosphere.heroAscii.map((line, lineIndex) => {
    if (reducedMotion) {
      return line;
    }

    return line
      .split("")
      .map((character, characterIndex) => {
        if (character === " ") {
          return character;
        }

        const shouldShift = (characterIndex + lineIndex + tick) % 9 === 0;
        return shouldShift ? ASCII_SWAP[(tick + characterIndex) % ASCII_SWAP.length] : character;
      })
      .join("");
  });

  return (
    <pre
      className={cn(
        "terminal-card liquid-panel overflow-hidden px-5 py-4 text-[0.68rem] leading-[1.3] tracking-[0.24em] text-[#8dffc3] shadow-[0_0_32px_rgba(109,255,176,0.08)] md:text-[0.78rem]",
        className,
      )}
    >
      {rows.join("\n")}
    </pre>
  );
}
