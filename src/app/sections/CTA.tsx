"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export function CTA() {
  return (
    <section className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-28 lg:px-24">
      <AnimatedSection>
        <p className="mb-4 font-mono text-xs tracking-widest text-orange-500/80">
          / Next
        </p>
        <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Ready to stop{" "}
          <span className="text-neutral-400">blending in?</span>
        </h2>
        <p className="mt-6 max-w-xl text-base text-neutral-400 md:text-lg">
          Let&apos;s build a website that actually works for your business —
          fast, clear, and built to get calls.
        </p>
        <a
          href="#contact"
          className="group mt-8 inline-flex items-center gap-3 rounded-md bg-white px-6 py-3.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          <span className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full">
              Start a project
            </span>
            <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
              Start a project
            </span>
          </span>
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </AnimatedSection>
    </section>
  );
}
