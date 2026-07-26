"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useMounted } from "@/lib/useMounted";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Rendered element. Page titles should pass "h1". */
  as?: "div" | "h1" | "h2" | "h3";
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Masked word stagger — words slide up out of an overflow-hidden line box.
 * Falls back to plain text when children aren't a string or motion is reduced.
 *
 * The reduced-motion branch waits for mount. The prerender cannot read a media
 * query, so it always emits the split-word markup; taking the plain-text branch
 * while hydrating made every page mismatch for reduced-motion visitors and cost
 * a full client re-render of the root.
 */
export function ScrollReveal({
  children,
  className,
  as = "div",
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();

  const Plain = as;

  if (typeof children !== "string" || (mounted && reduceMotion)) {
    return <Plain className={cn("text-white", className)}>{children}</Plain>;
  }

  const MotionTag = motion[as];
  const words = children.split(" ");

  return (
    <MotionTag
      className={cn("text-white", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.035 }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: { y: "0%", opacity: 1 },
            }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
