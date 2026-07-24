"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Lightweight smooth scroll via CSS only when motion is OK.
 * Lenis deferred — native smooth + Framer is enough for this pass.
 */
export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    if (reduceMotion) {
      root.style.scrollBehavior = "auto";
    } else {
      root.style.scrollBehavior = "smooth";
    }
    return () => {
      root.style.scrollBehavior = "";
    };
  }, [reduceMotion]);

  return null;
}
