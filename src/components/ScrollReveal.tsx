"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Masked word stagger — words slide up out of an overflow-hidden line box.
 * Falls back to plain text when children aren't a string or motion is reduced.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || typeof children !== "string") {
    return <div className={cn("text-white", className)}>{children}</div>;
  }

  const words = children.split(" ");

  return (
    <motion.div
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
    </motion.div>
  );
}
