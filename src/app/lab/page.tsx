"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

const experiments = [
  {
    id: "01",
    title: "Dot Matrix Wordmark",
    description:
      "5×7 SVG bitmaps with flicker timing — computational identity for ARRIQ.",
    status: "live" as const,
    href: "/",
  },
  {
    id: "02",
    title: "Grain & Vignette",
    description:
      "A24-style atmosphere — soft-light noise and edge falloff without muddying type.",
    status: "live" as const,
    href: "/",
  },
  {
    id: "03",
    title: "Snappy Cursor",
    description:
      "Custom crosshair/dot that expands on interactive targets — no laggy spring.",
    status: "live" as const,
    href: "/",
  },
  {
    id: "04",
    title: "Text Scramble",
    description:
      "Decode effect — characters cycle through random glyphs before settling.",
    status: "live" as const,
    href: "/",
  },
  {
    id: "05",
    title: "Magnetic Buttons",
    description:
      "Buttons that pull toward the cursor with spring physics on approach.",
    status: "live" as const,
    href: "/contact",
  },
  {
    id: "06",
    title: "SVG Connector Line",
    description:
      "Scroll-driven stroke draw that connects numbered process steps.",
    status: "live" as const,
    href: "/services",
  },
];

export default function LabPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pb-20 pt-32 md:px-12 md:pb-32 md:pt-40 lg:px-24">
        <SectionHeader
          label="Lab"
          index="01b"
          title="Personal lab — craft studies in public."
        />

        <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {experiments.map((exp, i) => (
            <AnimatedSection key={exp.id} delay={i * 0.06}>
              <article className="group flex h-full flex-col border border-neutral-800/80 bg-neutral-950/40 p-5 transition-colors hover:border-neutral-600 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-orange-500/80">
                    LAB /{exp.id}
                  </span>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 font-mono text-[10px] tracking-wide",
                      exp.status === "live"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-neutral-800 text-neutral-500"
                    )}
                  >
                    {exp.status}
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {exp.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {exp.description}
                </p>

                <div className="mt-auto pt-4">
                  <Link
                    href={exp.href}
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
      </section>
      <SiteFooter />
    </main>
  );
}
