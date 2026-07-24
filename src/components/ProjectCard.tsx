"use client";

import {
  ArrowUpRight,
  Newspaper,
  Palette,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

export type Project = {
  name: string;
  tag: string;
  stat: string;
  image?: string;
  comingSoon?: boolean;
  accent?: string;
  icon?: "media" | "brand" | "trade";
};

const ICONS: Record<NonNullable<Project["icon"]>, LucideIcon> = {
  media: Newspaper,
  brand: Palette,
  trade: Wrench,
};

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const hasImage = Boolean(project.image);
  const Icon = ICONS[project.icon ?? "trade"];

  return (
    <AnimatedSection delay={index * 0.1}>
      <article
        className={cn(
          "group relative aspect-[4/3] overflow-hidden rounded-lg",
          "border border-neutral-800/80 bg-neutral-900",
          "transition-[border-color,transform] duration-300",
          "hover:border-neutral-600 focus-within:border-neutral-600"
        )}
      >
        <div
          className="absolute inset-0"
          style={{
            background: hasImage
              ? undefined
              : `linear-gradient(145deg, ${project.accent ?? "#171717"} 0%, #0a0a0a 55%, #111 100%)`,
          }}
        />

        {hasImage ? (
          // Static export: plain img keeps project screenshots deploy-simple
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.name} — ${project.tag}`}
            className="absolute inset-0 size-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-25 transition-opacity group-hover:opacity-45">
            <Icon className="size-12 text-neutral-400" aria-hidden="true" />
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 0.75px, transparent 0.75px)",
            backgroundSize: "14px 14px",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {project.comingSoon && (
          <span className="absolute left-4 top-4 z-20 rounded-md border border-neutral-700 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            Coming Soon
          </span>
        )}

        <div className="absolute bottom-0 left-0 z-20 p-5 md:p-6">
          <p className="mb-1 text-xs uppercase tracking-wider text-neutral-400">
            {project.tag}
          </p>
          <h3 className="mb-1.5 font-display text-xl font-semibold tracking-tight">
            {project.name}
          </h3>
          <p className="text-sm text-orange-400/90">{project.stat}</p>
        </div>

        <div className="absolute right-4 top-4 z-20 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5 text-white" aria-hidden="true" />
        </div>
      </article>
    </AnimatedSection>
  );
}
