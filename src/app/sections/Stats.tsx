"use client";

import { AnimatedSection } from "@/components/AnimatedSection";

/** Static honesty strip — no count-up zeros (v4 CRITICAL) */
const stats = [
  {
    value: "2024",
    label: "Building since",
    note: "Personal brand in public",
  },
  {
    value: "7",
    label: "Service offerings",
    note: "Design through care",
  },
  {
    value: "$500+",
    label: "Typical project range",
    note: "Usually $500–$1,500+",
  },
  {
    value: "FL",
    label: "Based in Florida",
    note: "Remote-friendly worldwide",
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
            <p className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              {stat.value}
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
