"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

const studies = [
  {
    id: "01",
    title: "Dot Matrix Wordmark",
    description:
      "5×7 SVG bitmaps with flicker timing — computational identity for ARRIQ.",
    href: "/",
  },
  {
    id: "02",
    title: "Grain & Vignette",
    description:
      "A24-style atmosphere — soft-light noise and edge falloff without muddying type.",
    href: "/",
  },
  {
    id: "03",
    title: "Snappy Cursor",
    description:
      "Custom dot that expands and labels itself on interactive targets — no laggy spring.",
    href: "/work",
  },
  {
    id: "04",
    title: "Text Scramble",
    description:
      "Decode effect — characters cycle through random glyphs before settling.",
    href: "/lab/text-scramble-demo",
  },
  {
    id: "05",
    title: "Magnetic Buttons",
    description:
      "Buttons that pull toward the cursor with spring physics on approach.",
    href: "/contact",
  },
  {
    id: "06",
    title: "SVG Connector Line",
    description:
      "Scroll-driven stroke draw that connects numbered process steps.",
    href: "/services",
  },
] as const;

export function LabStudies() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {studies.map((study, i) => (
        <AnimatedSection key={study.id} delay={i * 0.06}>
          <article
            className={cn(
              "group relative flex h-full flex-col overflow-hidden border border-neutral-800/80 bg-neutral-950/40 p-5",
              "transition-all duration-300 hover:-translate-y-1 hover:border-neutral-600 md:p-6"
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-orange-500/70 transition-transform duration-500 group-hover:scale-x-100"
            />
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-orange-500/80">
                LAB /{study.id}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-orange-400">
                <span
                  className="size-1 rounded-full bg-current"
                  aria-hidden="true"
                />
                live
              </span>
            </div>

            <h3 className="font-display text-lg font-semibold tracking-tight">
              {study.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              {study.description}
            </p>

            <div className="mt-auto pt-4">
              <Link
                href={study.href}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-600 transition-colors group-hover:text-orange-400"
              >
                See it live
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </AnimatedSection>
      ))}
    </div>
  );
}
