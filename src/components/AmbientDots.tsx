"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Dot = { id: number; x: number; y: number; delay: number; size: number };

/** Sparse ambient field behind the hero — computational, not decorative noise */
export function AmbientDots() {
  const reduceMotion = useReducedMotion();
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const next: Dot[] = [];
    for (let i = 0; i < 48; i++) {
      next.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() > 0.7 ? 2 : 1.25,
      });
    }
    setDots(next);
  }, []);

  if (dots.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-40"
      aria-hidden="true"
    >
      {dots.map((dot) =>
        reduceMotion ? (
          <span
            key={dot.id}
            className="absolute rounded-full bg-neutral-600"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              opacity: 0.35,
            }}
          />
        ) : (
          <motion.span
            key={dot.id}
            className="absolute rounded-full bg-neutral-600"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
            }}
            animate={{ opacity: [0.12, 0.45, 0.18] }}
            transition={{
              duration: 4 + (dot.id % 5) * 0.4,
              delay: dot.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        )
      )}
    </div>
  );
}
