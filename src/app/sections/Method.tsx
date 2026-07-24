"use client";

import {
  Compass,
  LayoutTemplate,
  Code2,
  Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";

const steps: {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  {
    num: "01",
    title: "We uncover your story",
    desc: "We dig into your brand, surface what makes you irreplaceable, and shape sharp positioning for a site that gets calls.",
    icon: Compass,
  },
  {
    num: "02",
    title: "We shape your presence",
    desc: "With the narrative locked, we design a homepage that signals credibility and gives visitors one clear reason to act.",
    icon: LayoutTemplate,
  },
  {
    num: "03",
    title: "We build it",
    desc: "Fast, responsive, SEO-ready development — no page-builder bloat. Clean code that loads and ranks.",
    icon: Code2,
  },
  {
    num: "04",
    title: "We grow it",
    desc: "Launch, handoff, and ongoing support. SEO and maintenance so the site keeps working after day one.",
    icon: Rocket,
  },
];

export function Method() {
  return (
    <section
      id="method"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader
        label="Method"
        index="03"
        title="Project journey."
      />

      <ol className="relative mx-auto max-w-3xl list-none p-0">
        <div
          className="pointer-events-none absolute bottom-4 left-[1.35rem] top-4 w-px bg-gradient-to-b from-orange-500/50 via-neutral-700 to-neutral-800 md:left-[1.6rem]"
          aria-hidden="true"
        />

        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === steps.length - 1;
          return (
            <li key={step.num} className={isLast ? "" : "mb-12 md:mb-14"}>
              <AnimatedSection delay={i * 0.1}>
                <div className="relative flex gap-5 md:gap-8">
                  <div className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-md border border-neutral-700 bg-[#0a0a0a] md:size-14">
                    <Icon
                      className="size-4 text-orange-500 md:size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0 pt-0.5 md:pt-1">
                    <div className="mb-2 flex flex-wrap items-baseline gap-3">
                      <span className="font-mono text-sm text-neutral-600">
                        {step.num}
                      </span>
                      <h3 className="font-display text-xl font-semibold md:text-2xl">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-neutral-400 md:text-base">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
