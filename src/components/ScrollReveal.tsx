"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
};

/** Section titles: muted → white as they enter view */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn("text-white", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ color: "rgb(82 82 82)" }}
      whileInView={{ color: "rgb(255 255 255)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
