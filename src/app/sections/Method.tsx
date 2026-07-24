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
    title: "Position",
    desc: "Brand direction & reference system. We figure out what you actually need, not what trends say.",
    icon: Compass,
  },
  {
    num: "02",
    title: "Structure",
    desc: "Wireframes & homepage direction. Layout that guides visitors to take action.",
    icon: LayoutTemplate,
  },
  {
    num: "03",
    title: "Build",
    desc: "Design & development. Fast, responsive, SEO-ready code that performs.",
    icon: Code2,
  },
  {
    num: "04",
    title: "Launch",
    desc: "Deploy & handoff. You get the files, the knowledge, and ongoing support if needed.",
    icon: Rocket,
  },
];

export function Method() {
  return (
    <section className="border-t border-neutral-900 px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <SectionHeader label="The Method" />

      <div className="relative max-w-4xl">
        <div
          className="pointer-events-none absolute left-[1.15rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-neutral-700 via-neutral-800 to-transparent md:block"
          aria-hidden="true"
        />

        <ol className="grid list-none gap-12 p-0 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.num} className="relative">
                <AnimatedSection delay={i * 0.1}>
                  <div className="flex gap-6">
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-[#0a0a0a]">
                      <Icon
                        className="h-4 w-4 text-orange-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex items-baseline gap-3">
                        <span className="font-mono text-sm text-neutral-600">
                          {step.num}
                        </span>
                        <h3 className="font-display text-xl font-semibold">
                          {step.title}
                        </h3>
                      </div>
                      <p className="leading-relaxed text-neutral-400">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
