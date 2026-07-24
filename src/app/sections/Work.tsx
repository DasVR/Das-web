"use client";

import { ProjectCard, type Project } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/utils";

const projects: (Project & { offset?: string })[] = [
  {
    name: "Designwire",
    tag: "Media Platform",
    stat: "2M+ Followers",
    comingSoon: true,
    accent: "#1c1917",
    icon: "media",
    offset: "lg:mt-0",
  },
  {
    name: "Kurogo",
    tag: "Branding Agency",
    stat: "+23% CVR",
    comingSoon: true,
    accent: "#1a1a1a",
    icon: "brand",
    offset: "lg:mt-16",
  },
  {
    name: "Local Plumber",
    tag: "Small Business",
    stat: "3x Leads",
    comingSoon: true,
    accent: "#292524",
    icon: "trade",
    offset: "lg:mt-8",
  },
];

export function Work() {
  return (
    <section id="work" className="px-6 py-20 md:px-12 md:py-32 lg:px-24">
      <SectionHeader label="Work" index="01" />

      {/* playfight-inspired staggered grid — still readable, not collage clutter */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
        {projects.map((project, i) => (
          <div key={project.name} className={cn(project.offset)}>
            <ProjectCard project={project} index={i} />
          </div>
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
