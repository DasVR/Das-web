"use client";

import { motion, useReducedMotion } from "framer-motion";

const premiumSpring = {
  type: "spring" as const,
  stiffness: 110,
  damping: 20,
  mass: 1,
};

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.995 }}
      transition={premiumSpring}
    >
      {children}
    </motion.div>
  );
}
