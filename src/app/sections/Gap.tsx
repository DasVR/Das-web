"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

function Floater({
  className,
  y,
  rotate,
}: {
  className: string;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
}) {
  return <motion.div aria-hidden className={className} style={{ y, rotate }} />;
}

export function Gap() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yA = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const yB = useTransform(scrollYProgress, [0, 1], [-20, 60]);
  const yC = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const rA = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const rB = useTransform(scrollYProgress, [0, 1], [0, -12]);

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative overflow-hidden border-y border-neutral-900 bg-neutral-950/60"
    >
      <div className="relative flex h-28 items-center justify-center md:h-40">
        {!reduce ? (
          <>
            <Floater
              className="absolute left-[12%] top-6 h-10 w-10 rounded-full border border-neutral-800 bg-[#0a0a0a]/40"
              y={yA}
              rotate={rA}
            />
            <Floater
              className="absolute right-[18%] top-10 h-16 w-16 rounded-sm border border-orange-500/25 bg-orange-500/5"
              y={yB}
              rotate={rB}
            />
            <Floater
              className="absolute bottom-4 left-[42%] h-3 w-24 bg-neutral-800"
              y={yC}
              rotate={rA}
            />
          </>
        ) : null}
        <div className="h-px w-16 bg-neutral-800" />
      </div>
    </section>
  );
}
