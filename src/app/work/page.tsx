"use client";

import { ArrowUpRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MagneticButton } from "@/components/MagneticButton";
import { projects } from "@/lib/projects";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";

export default function WorkPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pb-20 pt-32 md:px-12 md:pb-32 md:pt-40 lg:px-24">
        <SectionHeader
          label="Work"
          index="01"
          title="Selected stories — honest work, no fake metrics."
          meta={
            <>
              <span className="text-neutral-300">Personal + client</span>
              <span>Case studies ship as real work lands</span>
              <span>No invented conversion numbers</span>
            </>
          }
        />

        <div className="mt-4 flex flex-col gap-4 md:gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>

        <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-600">
          Client case studies ship as real projects land. Personal experiments
          and this site stay visible in the meantime.
        </p>
      </section>

      <section className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <p className="mb-4 font-mono text-xs tracking-widest text-orange-500/80">
          / Next
        </p>
        <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Ready to stop <span className="text-neutral-400">blending in?</span>
        </h2>
        <p className="mt-6 max-w-xl text-base text-neutral-400 md:text-lg">
          Need a full site, a brand refresh, or a landing page that actually converts? Let&apos;s build something that works for your business.
        </p>
        <MagneticButton
          href="/contact"
          onActivate={() => triggerHaptic(HapticPatterns.medium)}
          className="group mt-8 items-center gap-3 rounded-md bg-white px-6 py-3.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          <span className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full">
              Start a project
            </span>
            <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
              Start a project
            </span>
          </span>
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </MagneticButton>
      </section>
      <SiteFooter />
    </main>
  );
}
