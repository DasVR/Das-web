"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const slideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.8,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 22,
      mass: 1,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-40%" : "40%",
    opacity: 0.4,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 22,
      mass: 1,
    },
  }),
};

/** Map routes to numeric order for directional sliding */
const routeOrder: Record<string, number> = {
  "/": 0,
  "/work": 1,
  "/lab": 2,
  "/about": 3,
  "/contact": 4,
  "/now": 5,
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentOrder = routeOrder[pathname] ?? 99;
  const direction = currentOrder;

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
