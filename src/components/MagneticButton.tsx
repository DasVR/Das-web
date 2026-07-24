"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
};

/** Subtle cursor pull on CTAs — max ~12–16px */
export function MagneticButton({
  children,
  href,
  className,
  strength = 0.22,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function onMove(e: MouseEvent) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({
      x: Math.max(-16, Math.min(16, x * strength)),
      y: Math.max(-12, Math.min(12, y * strength)),
    });
  }

  function onLeave() {
    setPos({ x: 0, y: 0 });
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={cn("inline-flex", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={reduceMotion ? undefined : { x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 350, damping: 22, mass: 0.2 }}
    >
      {children}
    </motion.a>
  );
}
