"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { DotMatrix } from "@/components/DotMatrix";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 md:px-12 lg:px-24">
      <div className="absolute left-6 top-6 text-xs tracking-widest text-neutral-500 md:left-12">
        LARGO, FL · EST 2026
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-4xl"
      >
        <div className="mb-8 h-14 w-56 text-neutral-300 md:h-16 md:w-72">
          <DotMatrix text="ARRIQ" />
        </div>

        <h1 className="mb-6 font-display text-5xl font-bold leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
          Websites that
          <br />
          speak your
          <br />
          brand&apos;s voice.
        </h1>

        <p className="max-w-lg text-lg leading-relaxed text-neutral-400 md:text-xl">
          Web design for small businesses in Largo, Florida. Fast, clean sites
          that look legit and turn visitors into calls — starting at $500.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-neutral-200"
          >
            View Work
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-3 transition-colors hover:border-orange-500/60 hover:text-orange-400"
          >
            Start a Project
          </a>
        </div>
      </motion.div>

      <div className="absolute bottom-12 left-6 flex items-center gap-2 text-neutral-600 md:left-12">
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm">Scroll to explore</span>
      </div>
    </section>
  );
}
