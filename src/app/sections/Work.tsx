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
    icon: "media",
  },
  {
    name: "Kurogo",
    tag: "Branding Agency",
    stat: "+23% CVR",
    comingSoon: true,
    accent: "#1a1a1a",
    icon: "brand",
  },
  {
    name: "Local Plumber",
    tag: "Small Business",
    stat: "3x Leads",
    comingSoon: true,
    accent: "#292524",
    icon: "trade",
  },
];

export function Work() {
  return (
    <section id="work" className="px-6 py-20 md:px-12 md:py-32 lg:px-24">
      <SectionHeader label="Selected Work" />

      <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-600">
        Case studies shipping soon. Focus: local trades and service businesses
        in the Tampa Bay area. Want one of these slots?{" "}
        <a href="#contact" className="text-neutral-400 underline-offset-4 hover:text-orange-400 hover:underline">
          Start a project
        </a>
        .
      </p>
    </section>
  );
}
