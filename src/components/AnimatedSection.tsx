"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.1, 0.25, 1] as const;

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  y = 24,
}: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
