"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AmbientDots } from "@/components/AmbientDots";
import { DotMatrix } from "@/components/DotMatrix";
import { MagneticButton } from "@/components/MagneticButton";
import { SiteNav } from "@/components/SiteNav";
import { TextScramble } from "@/components/TextScramble";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-24 md:px-12 md:pb-24 lg:px-24">
      <AmbientDots />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(249,115,22,0.08),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,#0a0a0a)]" />

      <div className="absolute left-6 top-6 z-30 font-mono text-[10px] tracking-[0.2em] text-neutral-500 md:left-12 md:text-xs">
        BASED IN FLORIDA · WORKING WIDELY
      </div>
      <SiteNav />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 max-w-5xl"
      >
        <div className="mb-6 h-16 w-64 text-neutral-200 md:mb-8 md:h-24 md:w-[22rem] lg:h-28 lg:w-[28rem]">
          <DotMatrix text="ARRIQ" gap={9} letterGap={12} radius={1.85} />
        </div>

        <h1 className="mb-6 font-display text-[2.85rem] font-bold leading-[0.92] tracking-tight sm:text-5xl md:mb-8 md:text-7xl lg:text-[5.75rem]">
          <TextScramble
            text="Websites that"
            as="span"
            className="block"
            delay={150}
          />
          <TextScramble
            text="speak your"
            as="span"
            className="block"
            delay={320}
          />
          <TextScramble
            text="brand's voice."
            as="span"
            className="block"
            delay={480}
          />
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-neutral-400 md:text-xl">
          Personal portfolio & web design for small businesses and independents.
          Design, brand, and build — so your presence finally matches what
          you&apos;ve built.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
          <MagneticButton
            href="#work"
            className="group items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 md:px-6 md:text-base"
          >
            <span className="relative overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                View Work
              </span>
              <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                View Work
              </span>
            </span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="items-center gap-2 rounded-md border border-neutral-700 px-5 py-3 text-sm transition-colors hover:border-orange-500/70 hover:text-orange-400 md:px-6 md:text-base"
          >
            Start a Project
          </MagneticButton>
        </div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 left-6 z-10 flex items-center gap-2 text-neutral-600 md:bottom-12 md:left-12"
      >
        <Plus className="size-4 text-orange-500/80" aria-hidden="true" />
        <span className="font-mono text-xs tracking-wide md:text-sm">
          scroll to explore
        </span>
      </motion.div>
    </section>
  );
}
