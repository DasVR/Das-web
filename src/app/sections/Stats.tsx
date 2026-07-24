"use client";

import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AnimatedSection } from "@/components/AnimatedSection";

const stats = [
  {
    value: 15,
    suffix: "+",
    label: "Projects in motion",
    note: "Client + personal",
  },
  {
    value: 7,
    suffix: "+",
    label: "Service offerings",
    note: "Design through care",
  },
  {
    value: 500,
    prefix: "$",
    suffix: "+",
    label: "Starting project size",
    note: "Scoped to fit",
  },
  {
    value: 1,
    suffix: "wk",
    label: "Typical turnaround",
    note: "When the brief is clear",
  },
] as const;

export function Stats() {
  return (
    <section
      id="stats"
      className="border-t border-neutral-900 px-6 py-16 md:px-12 md:py-20 lg:px-24"
      aria-label="Highlights"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <AnimatedSection key={stat.label} delay={i * 0.08}>
            <p className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl">
              <AnimatedCounter
                value={stat.value}
                prefix={"prefix" in stat ? stat.prefix : ""}
                suffix={stat.suffix}
              />
            </p>
            <p className="mt-2 text-sm text-neutral-300">{stat.label}</p>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-neutral-600">
              {stat.note}
            </p>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
