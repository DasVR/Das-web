"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin accent progress rail at the top of the viewport */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.3,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[70] h-px origin-left bg-orange-500/80"
      style={{ scaleX }}
    />
  );
}
