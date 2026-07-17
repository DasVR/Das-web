"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

import { BootSequence } from "@/components/site/boot-sequence";
import { CrtOverlay } from "@/components/site/crt-overlay";
import { CursorLens } from "@/components/site/cursor-lens";
import { DitherPlane } from "@/components/site/dither-plane";
import { HeroSection } from "@/components/site/hero-section";
import { MatrixRainCanvas } from "@/components/site/matrix-rain-canvas";
import { SectionCard } from "@/components/site/section-card";
import { SvgFilterDefs } from "@/components/site/svg-filter-defs";
import { TerminalPanel } from "@/components/site/terminal-panel";
import { atmosphere } from "@/config/atmosphere";

export function PortfolioShell() {
  const [bootComplete, setBootComplete] = useState(false);
  const projects = useMemo(() => atmosphere.projects, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <SvgFilterDefs />
      {!bootComplete ? <BootSequence onComplete={() => setBootComplete(true)} /> : null}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(109,255,176,0.11),transparent_25%),radial-gradient(circle_at_85%_10%,rgba(93,124,255,0.12),transparent_22%),linear-gradient(180deg,#06110d_0%,#040709_50%,#020405_100%)]"
      />
      <DitherPlane />
      <MatrixRainCanvas />
      <CursorLens />
      <CrtOverlay />

      <header className="fixed inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 lg:px-10">
        <div className="terminal-card liquid-panel flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-[#8ce6b3]">
              Das.web
            </p>
            <p className="text-xs text-[#8ebba2]">booted / matrix / refractive</p>
          </div>
          <nav className="hidden gap-3 font-mono text-xs text-[#d7ffe8] sm:flex">
            <a href="#work" className="rounded-full px-3 py-2 hover:bg-white/6">
              work
            </a>
            <a href="#about" className="rounded-full px-3 py-2 hover:bg-white/6">
              about
            </a>
            <a href="#contact" className="rounded-full px-3 py-2 hover:bg-white/6">
              contact
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <HeroSection />

        <div className="grid gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <motion.div
            id="work"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <SectionCard eyebrow="work / cards / craft" title="Terminal cards, but elevated into glass-backed objects.">
              <div className="space-y-4">
                <div className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-2">
                  {projects.map((project) => (
                    <article
                      key={project.title}
                      className="glass-filtered min-w-[18rem] snap-start rounded-[1.6rem] border border-white/10 bg-black/14 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      style={{ filter: "url(#liquid-glass-filter)" }}
                    >
                      <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-[#83d8aa]">
                        {project.label}
                      </p>
                      <h3 className="mt-3 text-xl font-medium text-[#ecfff4]">
                        {project.title}
                      </h3>
                      <p className="mt-2 leading-7">{project.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </SectionCard>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              id="about"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            >
              <SectionCard eyebrow="about / atmosphere" title="The design behaves like a quiet photograph.">
                <p className="leading-7">
                  The palette stays dark and liminal. The motion stays soft and
                  physical. The glass only appears where depth matters. The terminal
                  voice remains intact so the site still feels authored rather than
                  templated.
                </p>
              </SectionCard>
            </motion.div>

            <motion.div
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            >
              <SectionCard eyebrow="contact / output" title="Ready for a site that feels built, not generated.">
                <div className="space-y-3 font-mono text-sm">
                  <p>&gt; hello@dasvr.dev</p>
                  <p>&gt; github.com/DasVR</p>
                  <p>&gt; available for portfolio, brand, and interaction systems</p>
                </div>
              </SectionCard>
            </motion.div>
          </div>
        </div>
      </main>

      <TerminalPanel />
    </div>
  );
}
