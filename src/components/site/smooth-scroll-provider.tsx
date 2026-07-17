"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { prefersReducedMotion } from "@/lib/capability";
import { tempus } from "@/lib/tempus";

export function SmoothScrollProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
    });

    const unsubscribe = tempus.subscribe((time) => {
      lenis.raf(time);
    });

    return () => {
      unsubscribe();
      lenis.destroy();
    };
  }, []);

  return children;
}
