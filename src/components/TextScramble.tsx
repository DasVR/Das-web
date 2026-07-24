"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type TextScrambleProps = {
  text: string;
  className?: string;
  /** Delay before scramble starts (ms) */
  delay?: number;
  as?: "span" | "h1" | "h2" | "p";
};

/** One-shot decode effect — respects prefers-reduced-motion */
export function TextScramble({
  text,
  className,
  delay = 200,
  as: Tag = "span",
}: TextScrambleProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? text : "");

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    let i = 0;
    let started = false;

    const startTimer = window.setTimeout(() => {
      started = true;
    }, delay);

    const interval = window.setInterval(() => {
      if (!started) return;
      frame++;
      if (frame % 2 !== 0) return;

      if (i >= text.length) {
        setDisplay(text);
        window.clearInterval(interval);
        return;
      }

      const resolved = text.slice(0, i);
      const scramble = Array.from({ length: Math.min(3, text.length - i) }, () =>
        text[i] === " " || text[i] === "\n" || text[i] === "'"
          ? text[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join("");

      setDisplay(resolved + scramble + text.slice(i + scramble.length).replace(/[^\s\n']/g, "·"));
      i++;
    }, 28);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, [text, delay, reduceMotion]);

  return <Tag className={cn(className)}>{display || text}</Tag>;
}
