"use client";

import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { SectionHeader } from "@/components/SectionHeader";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function NowPage() {
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
            label="Now"
            index="03"
            title="What I&apos;m doing right now."
          />

          <div className="grid max-w-4xl gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8"
            >
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                BUILDING
              </p>
              <ul className="flex flex-col gap-3 text-base leading-relaxed text-neutral-300">
                <li>
                  Rebuilding this portfolio site — multi-page, motion-heavy, spring
                  physics everywhere
                </li>
                <li>
                  Learning GSAP ScrollTrigger for scroll-driven animations
                </li>
                <li>Planning a digital business card app (AirDrop + NFC, custom UI)</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8"
            >
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                LISTENING
              </p>
              <p className="text-base leading-relaxed text-neutral-300">
                Nirvana, Foo Fighters, Deftones, Korn — the usual rotation. Also
                getting into more ambient/cinematic stuff for late-night coding.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8"
            >
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                READING / WATCHING
              </p>
              <ul className="flex flex-col gap-3 text-base leading-relaxed text-neutral-300">
                <li>Dexter (rewatch, always)</li>
                <li>
                  Design Twitter — kail_designs, saurra3h, raunofreiberg for motion
                  inspo
                </li>
                <li>Cursor docs and Next.js 15 beta notes</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8"
            >
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                LOOKING FOR
              </p>
              <p className="text-base leading-relaxed text-neutral-300">
                New small-business projects to take on. Ideally $500–$1,500 range.
                Web design, landing pages, brand refreshes — hit me up.{" "}
                <a
                  href="/contact"
                  className="text-orange-400 hover:underline"
                >
                  Start a project →
                </a>
              </p>
            </motion.div>
          </div>

          <p className="mt-10 text-sm text-neutral-600">
            Inspired by{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-orange-400"
            >
              nownownow.com
            </a>
            . Updated whenever life changes.
          </p>
        </section>
      </motion.div>
    </main>
  );
}
