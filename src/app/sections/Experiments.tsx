"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { DotMatrix } from "@/components/DotMatrix";
import { SectionHeader } from "@/components/SectionHeader";

const experiments = [
  {
    title: "Dot Matrix Wordmark",
    blurb: "5×7 SVG bitmaps with flicker timing — computational identity for DasDev.",
    visual: "dots" as const,
  },
  {
    title: "Grain & Vignette",
    blurb: "A24-style atmosphere — soft-light noise and edge falloff without muddying type.",
    visual: "grain" as const,
  },
  {
    title: "Snappy Cursor",
    blurb: "Custom crosshair/dot that expands on interactive targets — no laggy spring.",
    visual: "cursor" as const,
  },
];

export function Experiments() {
  return (
    <section
      id="experiments"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-28 lg:px-24"
    >
      <SectionHeader
        label="Experiments"
        index="01b"
        title="Personal lab — craft studies in public."
      />

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {experiments.map((item, i) => (
          <AnimatedSection key={item.title} delay={i * 0.08}>
            <article className="flex h-full flex-col border border-neutral-800/80 bg-neutral-950/40 p-5 transition-colors hover:border-neutral-600 md:p-6">
              <div className="relative mb-5 flex h-28 items-center justify-center overflow-hidden border border-neutral-900 bg-[#0a0a0a]">
                {item.visual === "dots" ? (
                  <div className="h-10 w-36 text-neutral-400">
                    <DotMatrix text="DASDEV" gap={4} letterGap={5} radius={1.1} />
                  </div>
                ) : null}
                {item.visual === "grain" ? (
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-soft-light"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                    aria-hidden="true"
                  />
                ) : null}
                {item.visual === "cursor" ? (
                  <div className="relative size-10" aria-hidden="true">
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/80" />
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/80" />
                    <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500" />
                  </div>
                ) : null}
              </div>
              <p className="mb-2 font-mono text-[10px] tracking-widest text-orange-500/80">
                LAB /{String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {item.blurb}
              </p>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
