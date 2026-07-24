"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteNav } from "@/components/SiteNav";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { projects } from "@/lib/projects";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function WorkPage() {
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
            label="Work"
            index="01"
            title="Selected stories — honest work, no fake metrics."
          />

          <div className="flex flex-col gap-4 md:gap-5 mt-12">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>

          <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-600">
            Client case studies ship as real projects land. Personal experiments
            and this site stay visible in the meantime.{" "}
            <a
              href="/contact"
              className="text-neutral-400 underline-offset-4 hover:text-orange-400 hover:underline"
            >
              Start a project
            </a>
            .
          </p>
        </section>

        {/* CTA Footer */}
        <section className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-28 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="mb-4 font-mono text-xs tracking-widest text-orange-500/80">
              / Next
            </p>
            <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Ready to stop{" "}
              <span className="text-neutral-400">blending in?</span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-neutral-400 md:text-lg">
              Whether you need a full site, a brand refresh, or a sharp landing
              page — let&apos;s make something that works for your business.
            </p>
            <a
              href="/contact"
              className="inline-flex group mt-8 items-center gap-3 rounded-md bg-white px-6 py-3.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              <span className="relative overflow-hidden">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  Start a project
                </span>
                <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                  Start a project
                </span>
              </span>
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
}
