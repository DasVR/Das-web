"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AmbientDots } from "@/components/AmbientDots";
import { DotMatrix } from "@/components/DotMatrix";
import { SiteNav } from "@/components/SiteNav";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-24 md:px-12 md:pb-24 lg:px-24">
      <AmbientDots />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(249,115,22,0.07),transparent_45%)]" />

      <div className="absolute left-6 top-6 z-30 text-[10px] tracking-[0.2em] text-neutral-500 md:left-12 md:text-xs">
        LARGO, FL · EST 2026
      </div>
      <SiteNav />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 max-w-4xl"
      >
        <div className="mb-6 h-16 w-64 text-neutral-200 md:mb-8 md:h-24 md:w-[22rem] lg:h-28 lg:w-[26rem]">
          <DotMatrix text="ARRIQ" gap={9} letterGap={12} radius={1.85} />
        </div>

        <h1 className="mb-5 font-display text-[2.75rem] font-bold leading-[0.92] tracking-tight sm:text-5xl md:mb-6 md:text-7xl lg:text-8xl">
          Websites that
          <br />
          speak your
          <br />
          brand&apos;s voice.
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-neutral-400 md:text-xl">
          Web design for small businesses in Largo, Florida. Fast, clean sites
          that look legit and turn visitors into calls — starting at $500.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 md:px-6 md:text-base"
          >
            View Work
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-5 py-3 text-sm transition-colors hover:border-orange-500/70 hover:text-orange-400 md:px-6 md:text-base"
          >
            Start a Project
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 left-6 z-10 flex items-center gap-2 text-neutral-600 md:bottom-12 md:left-12"
      >
        <Plus className="size-4 text-orange-500/80" aria-hidden="true" />
        <span className="text-sm">Scroll to explore</span>
      </motion.div>
    </section>
  );
}
