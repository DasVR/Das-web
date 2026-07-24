"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { AnimatedSection } from "@/components/AnimatedSection";

const STEPS = [
  {
    num: "01",
    title: "Discover",
    body: "We clarify goals, audience, and constraints — what you sell, who you serve, and what success looks like.",
  },
  {
    num: "02",
    title: "Design",
    body: "Structure, visual system, and interaction details that feel intentional on every screen size.",
  },
  {
    num: "03",
    title: "Build",
    body: "Production-ready Next.js or static delivery: fast loads, clean markup, and content you can update.",
  },
  {
    num: "04",
    title: "Launch",
    body: "Ship, measure, and iterate — SEO basics, analytics hooks, and a clear path for the next release.",
  },
] as const;

export function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 40%"],
  });
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.35,
  });
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0.5, 0.9]);
  const glowTop = useTransform(scrollYProgress, [0, 1], ["0%", "96%"]);

  return (
    <section
      ref={sectionRef}
      id="method"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="03" label="Method" title="How we work" />

        <div className="relative mt-4 grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
          <div
            className="relative mx-auto hidden h-full min-h-[28rem] w-12 md:block"
            aria-hidden="true"
          >
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 48 448"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M24 8 V440"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <motion.path
                d="M24 8 V440"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength }}
              />
            </svg>
            <motion.div
              className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.55)]"
              style={{
                top: glowTop,
                opacity: glowOpacity,
              }}
            />
          </div>

          <ol className="space-y-0">
            {STEPS.map((step, i) => (
              <li key={step.num}>
                <AnimatedSection delay={i * 0.06}>
                  <div className="grid gap-3 border-b border-neutral-800 py-8 md:grid-cols-[5rem_1fr] md:gap-8 md:py-10">
                    <span className="font-mono text-sm text-orange-500">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-400">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
