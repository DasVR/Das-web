"use client";

import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { SectionHeader } from "@/components/SectionHeader";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function AboutPage() {
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
            label="About"
            index="02"
            title="Designer & builder. Personal work, client work, clear services."
          />

          <div className="grid max-w-5xl gap-10 mt-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="flex max-w-xl flex-col gap-4 text-base leading-relaxed text-neutral-400 md:text-lg">
                <p>
                  I&apos;m Arriq — this site is my portfolio and the front door to Das Web
                  Design. I care about taste, speed, and sites that feel like the people
                  behind them.
                </p>
                <p>
                  I work with small businesses and independents across industries —
                  consultants, shops, hospitality, creators, service businesses, and more.
                  If you need a presence that looks legit and gets inquiries, that&apos;s the
                  work.
                </p>
                <p>
                  Based in Florida. Happy to collaborate remotely. No page-builder bloat
                  — just clean design and code you can grow with.
                </p>
              </div>

              <div className="mt-10 border-t border-neutral-900 pt-8">
                <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                  NOW
                </p>
                <p className="max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
                  Shipping this portfolio in public, taking new small-business projects,
                  and expanding the experiments lab (motion, type, and interaction
                  studies).
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <dl className="grid grid-cols-2 gap-6 border border-neutral-800/80 bg-neutral-950/50 p-6 md:p-8">
                <div className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                    Based
                  </dt>
                  <dd className="font-display text-lg text-neutral-200">
                    Florida, USA
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                    Reach
                  </dt>
                  <dd className="font-display text-lg text-neutral-200">
                    Clients anywhere
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                    Focus
                  </dt>
                  <dd className="font-display text-lg text-neutral-200">
                    Small business
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                    Projects
                  </dt>
                  <dd className="font-display text-lg text-neutral-200">
                    $500–$1,500+
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <p className="mb-3 font-mono text-[10px] tracking-widest text-neutral-600">
                  TOOLS
                </p>
                <ul className="flex flex-wrap gap-2">
                  {[
                    "Next.js",
                    "Tailwind",
                    "Framer Motion",
                    "shadcn/ui",
                    "TypeScript",
                    "Figma",
                    "Docker",
                    "Cloudflare",
                  ].map((tool) => (
                    <li
                      key={tool}
                      className="rounded-md border border-neutral-800 px-2.5 py-1 font-mono text-[11px] text-neutral-500"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
