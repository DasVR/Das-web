"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { SectionHeader } from "@/components/SectionHeader";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const experiments = [
  {
    id: "01",
    title: "Dot Matrix Wordmark",
    description:
      "5×7 SVG bitmaps with flicker timing — computational identity for ARRIQ.",
    status: "live",
  },
  {
    id: "02",
    title: "Grain & Vignette",
    description:
      "A24-style atmosphere — soft-light noise and edge falloff without muddying type.",
    status: "live",
  },
  {
    id: "03",
    title: "Snappy Cursor",
    description:
      "Custom crosshair/dot that expands on interactive targets — no laggy spring.",
    status: "live",
  },
  {
    id: "04",
    title: "Text Scramble",
    description:
      "Decode effect — characters cycle through random glyphs before settling.",
    status: "live",
  },
  {
    id: "05",
    title: "Magnetic Buttons",
    description:
      "Buttons that pull toward the cursor with spring physics on approach.",
    status: "in progress",
  },
  {
    id: "06",
    title: "SVG Connector Line",
    description:
      "Scroll-driven stroke draw that connects numbered process steps.",
    status: "planned",
  },
];

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <GrainOverlay />
      <CustomCursor />
      <SiteNav />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <section className="px-6 pt-32 pb-20 md:px-12 md:pt-40 md:pb-32 lg:px-24">
          <SectionHeader
            label="Lab"
            index="01b"
            title="Personal lab — craft studies in public."
          />

          <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {experiments.map((exp, i) => (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="group flex h-full flex-col border border-neutral-800/80 bg-neutral-950/40 p-5 transition-colors hover:border-neutral-600 md:p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-orange-500/80">
                    LAB /{exp.id}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] tracking-wide ${
                      exp.status === "live"
                        ? "bg-green-500/10 text-green-400"
                        : exp.status === "in progress"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-neutral-800 text-neutral-500"
                    }`}
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
                  <a
                    href="/"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-600 transition-colors group-hover:text-orange-400"
                  >
                    View experiment
                    <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </motion.div>
    </main>
  );
}
