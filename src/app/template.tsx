"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMounted } from "@/lib/useMounted";

const pageSpring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 22,
  mass: 1,
};

const slideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.8,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: pageSpring,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-40%" : "40%",
    opacity: 0.4,
    transition: pageSpring,
  }),
};

/** Map routes to numeric order for directional sliding */
const routeOrder: Record<string, number> = {
  "/": 0,
  "/work": 1,
  "/lab": 2,
  "/about": 3,
  "/services": 4,
  "/contact": 5,
  "/now": 6,
};

/** Portal routes are a tool, not a narrative; sliding between them feels wrong. */
const portalPrefixes = ["/dashboard", "/admin"];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const direction = routeOrder[pathname] ?? 99;

  const isPortal = portalPrefixes.some((prefix) => pathname.startsWith(prefix));

  // The reduced-motion branch waits for mount: the prerender always takes the
  // animated path, so deciding differently while hydrating would mismatch.
  if (isPortal || (mounted && reduceMotion)) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
