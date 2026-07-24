"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Trigger scramble when element scrolls into view — one-shot */
export function ScrollTextScramble({
  text,
  className,
  as: Tag = "span",
  scrambleSpeed = 28,
  charsPerFrame = 1,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  scrambleSpeed?: number;
  charsPerFrame?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(reduceMotion ? text : "·".repeat(text.length));
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text);
      return;
    }
    if (!isInView || hasTriggered) return;

    setHasTriggered(true);
    let frame = 0;
    let i = 0;

    const interval = window.setInterval(() => {
      frame++;
      if (frame % 2 !== 0) return;

      if (i >= text.length) {
        setDisplay(text);
        window.clearInterval(interval);
        return;
      }

      const resolved = text.slice(0, i);
      const remaining = text.length - i;
      const scrambleLen = Math.min(charsPerFrame + 1, remaining);
      const scramble = Array.from({ length: scrambleLen }, (_, idx) => {
        const char = text[i + idx];
        return char === " " || char === "\n" || char === "'" || char === "·" || char === "." || char === "," || char === "—" || char === "–"
          ? char
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      const hidden = text
        .slice(i + scrambleLen)
        .replace(/[^\s\n'.—–,]/g, "·");

      setDisplay(resolved + scramble + hidden);
      i += charsPerFrame;
    }, scrambleSpeed);

    return () => window.clearInterval(interval);
  }, [isInView, text, reduceMotion, hasTriggered, scrambleSpeed, charsPerFrame]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {display}
    </Tag>
  );
}

/** Premium staggered scramble — each word scrambles in with a wave effect */
export function StaggerTextScramble({
  text,
  className,
  as: Tag = "span",
  wordDelay = 80,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  wordDelay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  const [revealedWords, setRevealedWords] = useState<number>(reduceMotion ? words.length : 0);

  useEffect(() => {
    if (reduceMotion) return;
    if (!isInView) return;

    let current = 0;
    const interval = window.setInterval(() => {
      current++;
      if (current > words.length) {
        window.clearInterval(interval);
        return;
      }
      setRevealedWords(current);
    }, wordDelay);

    return () => window.clearInterval(interval);
  }, [isInView, words.length, reduceMotion, wordDelay]);

  return (
    <Tag ref={ref} className={cn("inline", className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {i < revealedWords ? (
            <ScrambleWord word={word} trigger={true} />
          ) : (
            <span className="text-neutral-700">{"·".repeat(word.length)}</span>
          )}
          {i < words.length - 1 && <span> </span>}
        </span>
      ))}
    </Tag>
  );
}

/** Single word scramble — internal component */
function ScrambleWord({ word, trigger }: { word: string; trigger: boolean }) {
  const [display, setDisplay] = useState(word);

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    let i = 0;

    const interval = window.setInterval(() => {
      frame++;
      if (frame % 2 !== 0) return;

      if (i >= word.length) {
        setDisplay(word);
        window.clearInterval(interval);
        return;
      }

      const resolved = word.slice(0, i);
      const scramble = Array.from({ length: Math.min(2, word.length - i) }, (_, idx) => {
        const char = word[i + idx];
        return char === " " || char === "\n" || char === "'" || char === "." || char === ","
          ? char
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      const hidden = word
        .slice(i + scramble.length)
        .replace(/[^\s\n'.,]/g, "·");

      setDisplay(resolved + scramble + hidden);
      i++;
    }, 24);

    return () => window.clearInterval(interval);
  }, [trigger, word]);

  return <span>{display}</span>;
}

/** Scroll-reveal headline: color fade + scramble decode combined */
export function ScrollRevealScramble({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(reduceMotion ? text : "·".repeat(text.length));
  const [color, setColor] = useState("rgb(82 82 82)");

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text);
      setColor("rgb(255 255 255)");
      return;
    }
    if (!isInView) return;

    // Step 1: fade color from muted to white
    setColor("rgb(255 255 255)");

    // Step 2: scramble decode
    let frame = 0;
    let i = 0;

    const interval = window.setInterval(() => {
      frame++;
      if (frame % 2 !== 0) return;

      if (i >= text.length) {
        setDisplay(text);
        window.clearInterval(interval);
        return;
      }

      const resolved = text.slice(0, i);
      const remaining = text.length - i;
      const scramble = Array.from({ length: Math.min(3, remaining) }, () => {
        const char = text[i];
        return char === " " || char === "\n" || char === "'" || char === "." || char === "," || char === "—"
          ? char
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      const hidden = text
        .slice(i + scramble.length)
        .replace(/[^\s\n'.,—]/g, "·");

      setDisplay(resolved + scramble + hidden);
      i++;
    }, 30);

    return () => window.clearInterval(interval);
  }, [isInView, text, reduceMotion]);

  return (
    <Tag
      ref={ref}
      className={cn("transition-colors duration-700", className)}
      style={{ color }}
    >
      {display}
    </Tag>
  );
}
