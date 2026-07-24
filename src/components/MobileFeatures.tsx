"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode } from "react";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";

/** Parallax wrapper for images and sections */
export function ParallaxSection({
  children,
  speed = 0.5,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Scroll progress indicator — thin bar at top */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-orange-500"
      style={{ scaleX }}
    />
  );
}

/** Pull-to-refresh style spring indicator (visual only) */
export function PullIndicator({ isPulling }: { isPulling: boolean }) {
  return (
    <motion.div
      className="fixed left-1/2 top-4 z-[55] -translate-x-1/2"
      animate={{
        opacity: isPulling ? 1 : 0,
        y: isPulling ? 0 : -20,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center gap-2 rounded-full bg-neutral-900/90 px-4 py-2 backdrop-blur">
        <motion.div
          animate={{ rotate: isPulling ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          ↓
        </motion.div>
        <span className="font-mono text-[10px] text-neutral-400">
          Refresh
        </span>
      </div>
    </motion.div>
  );
}

/** Touch target sizing helper with haptic feedback */
export function TouchTarget({
  children,
  className,
  onTap,
  hapticPattern = HapticPatterns.light,
}: {
  children: ReactNode;
  className?: string;
  onTap?: () => void;
  hapticPattern?: number | number[];
}) {
  const handleTap = () => {
    triggerHaptic(hapticPattern);
    onTap?.();
  };

  return (
    <motion.button
      className={`touch-manipulation ${className}`}
      onTap={handleTap}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.button>
  );
}

/** Swipeable card for mobile galleries */
export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
}: {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x < -80) onSwipeLeft?.();
        if (info.offset.x > 80) onSwipeRight?.();
      }}
      className="touch-pan-y"
    >
      {children}
    </motion.div>
  );
}
