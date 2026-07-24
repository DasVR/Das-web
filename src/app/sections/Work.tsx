"use client";

import { ProjectCard, type Project } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";

const projects: Project[] = [
  {
    name: "Designwire",
    tag: "Media Platform",
    stat: "2M+",
    result: "A media presence shaped to feel inevitable — brand, layout, and pace.",
    comingSoon: true,
    indexLabel: "SS /01",
  },
  {
    name: "Kurogo",
    tag: "Brand Studio",
    stat: "+23%",
    result: "Clearer story and faster pages for a studio that needed sharper conversion.",
    comingSoon: true,
    indexLabel: "SS /02",
  },
  {
    name: "Harbor & Co.",
    tag: "Small Business",
    stat: "3x",
    result: "Inquiry lift after trust, hierarchy, and CTAs were rebuilt for the brand.",
    comingSoon: true,
    indexLabel: "SS /03",
  },
];

export function Work() {
  return (
    <section id="work" className="px-6 py-20 md:px-12 md:py-32 lg:px-24">
      <SectionHeader
        label="Work"
        index="01"
        title="Selected stories — client work and personal experiments."
      />

      <div className="flex flex-col gap-4 md:gap-5">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-600">
        Case studies shipping soon — across industries, not one niche. Want a
        slot in the portfolio?{" "}
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
