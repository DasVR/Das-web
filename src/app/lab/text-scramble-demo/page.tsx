"use client";

import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollTextScramble, StaggerTextScramble, ScrollRevealScramble } from "@/components/ScrollTextScramble";

export default function TextScrambleDemoPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <GrainOverlay />
      <CustomCursor />
      <SiteNav />

      <div className="px-6 pt-40 pb-20 md:px-12 md:pt-48 md:pb-32 lg:px-24">
        <div className="mx-auto max-w-3xl space-y-32">
          {/* Variant 1: Basic Scroll Scramble */}
          <section>
            <p className="mb-4 font-mono text-xs tracking-widest text-orange-500/80">
              VARIANT 1 — BASIC SCROLL SCRAMBLE
            </p>
            <ScrollTextScramble
              as="h2"
              text="This headline scrambles when it enters the viewport."
              className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
            />
          </section>

          {/* Variant 2: Staggered Word Scramble */}
          <section>
            <p className="mb-4 font-mono text-xs tracking-widest text-orange-500/80">
              VARIANT 2 — STAGGERED WORD SCRAMBLE
            </p>
            <StaggerTextScramble
              as="h2"
              text="Each word reveals in sequence creating a wave effect across the headline."
              className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
              wordDelay={120}
            />
          </section>

          {/* Variant 3: Scroll Reveal + Scramble Combined */}
          <section>
            <p className="mb-4 font-mono text-xs tracking-widest text-orange-500/80">
              VARIANT 3 — COLOR FADE + SCRAMBLE COMBINED
            </p>
            <ScrollRevealScramble
              as="h2"
              text="Headlines fade from muted grey to white while decoding in real time."
              className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
            />
          </section>

          {/* Variant 4: Slow cinematic scramble */}
          <section>
            <p className="mb-4 font-mono text-xs tracking-widest text-orange-500/80">
              VARIANT 4 — CINEMATIC SLOW SCRAMBLE
            </p>
            <ScrollTextScramble
              as="h2"
              text="Slower decode for dramatic reveals on key headlines."
              className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
              scrambleSpeed={60}
              charsPerFrame={1}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
