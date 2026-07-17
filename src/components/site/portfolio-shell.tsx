"use client";

import { motion } from "motion/react";

import { DustField } from "@/components/ruin/dust-field";
import { Vine } from "@/components/ruin/vine";
import { HeroSection } from "@/components/site/hero-section";
import { SectionCard } from "@/components/site/section-card";
import { SvgFilterDefs } from "@/components/site/svg-filter-defs";
import { atmosphere } from "@/config/atmosphere";

export function PortfolioShell() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <SvgFilterDefs />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_62%_0%,rgba(222,208,169,0.16),transparent_28%),linear-gradient(180deg,#252a20_0%,#1a1e18_48%,#121510_100%)]"
      />
      <DustField />

      <header className="fixed inset-x-0 top-0 z-30 px-5 pt-5 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between border-b border-[#d8c99e]/12 pb-4">
          <div>
            <p className="font-serif text-lg tracking-[-0.02em] text-[#ede7d9]">
              Das.web
            </p>
            <p className="text-[0.58rem] uppercase tracking-[0.26em] text-[#b9af94]/50">
              quiet work / living archive
            </p>
          </div>
          <nav className="flex gap-5 text-[0.62rem] uppercase tracking-[0.24em] text-[#d0c7ae]/55 sm:gap-8">
            <a href="#work" className="transition-colors hover:text-[#eee6d3]">Work</a>
            <a href="#about" className="transition-colors hover:text-[#eee6d3]">About</a>
            <a href="#contact" className="transition-colors hover:text-[#eee6d3]">Contact</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <HeroSection />

        <div className="relative mx-auto grid max-w-[88rem] gap-8 px-5 py-28 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-14">
          <Vine className="absolute -top-20 -right-20 h-[36rem] w-44 text-[#5f6d49]/35" />
          <motion.div
            id="work"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionCard eyebrow="selected work / field notes" title="Interfaces composed like photographs, not assembled like templates.">
              <div className="space-y-4">
                <div className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-2">
                  {atmosphere.projects.map((project, projectIndex) => (
                    <article
                      key={project.title}
                      className="project-fragment min-w-[19rem] snap-start border-l border-[#cfc3a3]/18 p-5"
                    >
                      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#aeb38c]/65">
                        0{projectIndex + 1} / {project.label}
                      </p>
                      <h3 className="mt-5 font-serif text-2xl text-[#e7e0d1]">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#aaa699]">{project.description}</p>
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
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              <SectionCard eyebrow="about / the eye behind it" title="The design behaves like a quiet photograph.">
                <p className="leading-7">
                  I work with light, weight, silence, and texture before decoration.
                  Motion is slow enough to notice only when it stops; glass appears
                  where a real window might still catch the sky.
                </p>
              </SectionCard>
            </motion.div>

            <motion.div
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <SectionCard eyebrow="contact / leave a trace" title="Make something worth finding years from now.">
                <div className="space-y-3 text-sm leading-7">
                  <p>hello@dasvr.dev</p>
                  <p>github.com/DasVR</p>
                  <p className="text-[#969287]">Available for portfolio, brand, and interaction systems.</p>
                </div>
              </SectionCard>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
