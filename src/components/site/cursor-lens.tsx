"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { canHover, hasCoarsePointer, prefersReducedMotion } from "@/lib/capability";

export function CursorLens() {
  const pointerX = useMotionValue(-160);
  const pointerY = useMotionValue(-160);
  const x = useSpring(pointerX, { damping: 28, stiffness: 240, mass: 0.7 });
  const y = useSpring(pointerY, { damping: 28, stiffness: 240, mass: 0.7 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isEnabled =
      canHover() && !hasCoarsePointer() && !prefersReducedMotion();

    setEnabled(isEnabled);

    if (!isEnabled) {
      return;
    }

    const move = (event: PointerEvent) => {
      pointerX.set(event.clientX - 84);
      pointerY.set(event.clientY - 84);
    };

    window.addEventListener("pointermove", move);

    return () => {
      window.removeEventListener("pointermove", move);
    };
  }, [pointerX, pointerY]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed top-0 left-0 z-20 size-42 rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),rgba(255,255,255,0.08)_25%,rgba(109,255,176,0.06)_45%,rgba(0,0,0,0.02)_70%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.34),0_0_36px_rgba(109,255,176,0.1)] backdrop-blur-md"
    />
  );
}
