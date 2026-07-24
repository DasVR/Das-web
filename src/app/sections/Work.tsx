"use client";

import { ProjectCard, type Project } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";

const projects: Project[] = [
  {
    name: "Designwire",
    tag: "Media Platform",
    stat: "2M+ Followers",
    comingSoon: true,
    accent: "#1c1917",
  },
  {
    name: "Kurogo",
    tag: "Branding Agency",
    stat: "+23% CVR",
    comingSoon: true,
    accent: "#1a1a1a",
  },
  {
    name: "Local Plumber",
    tag: "Small Business",
    stat: "3x Leads",
    comingSoon: true,
    accent: "#292524",
  },
];

export function Work() {
  return (
    <section id="work" className="px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <SectionHeader label="Selected Work" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>

      <p className="mt-10 max-w-xl text-sm text-neutral-600">
        Case studies shipping soon. In the meantime — local trades and service
        businesses are the focus. See something you want built? Reach out.
      </p>
    </section>
  );
}
