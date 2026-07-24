"use client";

import { ProjectCard, type Project } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";

const projects: Project[] = [
  {
    name: "Designwire",
    tag: "Media Platform",
    stat: "2M+",
    result: "Followers reached through a media presence built to look inevitable.",
    comingSoon: true,
    indexLabel: "SS /01",
  },
  {
    name: "Kurogo",
    tag: "Branding Agency",
    stat: "+23%",
    result: "Conversion lift after a clearer site story and faster pages.",
    comingSoon: true,
    indexLabel: "SS /02",
  },
  {
    name: "Local Plumber",
    tag: "Small Business",
    stat: "3x",
    result: "Increase in call bookings once trust and CTA hierarchy were fixed.",
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
        title="Selected stories — real results, not fluff."
      />

      <div className="flex flex-col gap-4 md:gap-5">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-600">
        Case studies shipping soon. Focus: local trades and service businesses
        in the Tampa Bay area. Want one of these slots?{" "}
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
