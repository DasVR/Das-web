"use client";

import { ArrowUpRight, ImageIcon } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

export type Project = {
  name: string;
  tag: string;
  stat: string;
  image?: string;
  comingSoon?: boolean;
  accent?: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const hasImage = Boolean(project.image);

  return (
    <AnimatedSection delay={index * 0.1}>
      <article
        className={cn(
          "group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg",
          "border border-neutral-800/80 bg-neutral-900"
        )}
      >
        {/* Gradient / image placeholder */}
        <div
          className="absolute inset-0"
          style={{
            background: hasImage
              ? undefined
              : `linear-gradient(145deg, ${project.accent ?? "#171717"} 0%, #0a0a0a 55%, #111 100%)`,
          }}
        />

        {!hasImage && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 transition-opacity group-hover:opacity-50">
            <ImageIcon className="h-10 w-10 text-neutral-500" aria-hidden="true" />
          </div>
        )}

        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 0.75px, transparent 0.75px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        {project.comingSoon && (
          <span className="absolute left-4 top-4 z-20 rounded-full border border-neutral-700 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-widest text-neutral-400">
            Coming Soon
          </span>
        )}

        <div className="absolute bottom-0 left-0 z-20 p-6">
          <p className="mb-1 text-xs text-neutral-400">{project.tag}</p>
          <h3 className="mb-2 font-display text-xl font-semibold tracking-tight">
            {project.name}
          </h3>
          <p className="text-sm text-neutral-300">{project.stat}</p>
        </div>

        <div className="absolute right-4 top-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
      </article>
    </AnimatedSection>
  );
}
