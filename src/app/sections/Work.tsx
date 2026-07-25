"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { projects } from "@/lib/projects";

export function Work() {
  return (
    <section id="work" className="px-6 py-20 md:px-12 md:py-32 lg:px-24">
      <SectionHeader
        label="Work"
        index="01"
        title="Selected stories. Honest work, no fake metrics."
      />

      <div className="flex flex-col gap-4 md:gap-5">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-600">
        Client case studies ship as real projects land. Personal experiments and
        this site stay visible in the meantime.{" "}
        <a
          href="#contact"
          className="text-neutral-400 underline-offset-4 hover:text-orange-400 hover:underline"
        >
          Start a project
        </a>
        .
      </p>
    </section>
  );
}
