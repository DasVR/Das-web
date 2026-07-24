"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Tight follow cursor — no spring lag; expands on interactive hover */
export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    if (!fine || !hover || reduceMotion) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const el = e.target as HTMLElement | null;
      setHovering(
        Boolean(el?.closest("a, button, input, textarea, [role='button']"))
      );
    }
    function onLeave() {
      setVisible(false);
      setHovering(false);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduceMotion]);

  if (!enabled) return null;

  const size = hovering ? 36 : 8;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white"
        animate={{
          width: size,
          height: size,
          backgroundColor: hovering
            ? "rgba(255,255,255,0)"
            : "rgba(255,255,255,1)",
        }}
        transition={{ duration: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}
