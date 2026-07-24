"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

export type Project = {
  name: string;
  tag: string;
  stat: string;
  /** Short metric caption under the big number */
  result: string;
  image?: string;
  comingSoon?: boolean;
  accent?: string;
  icon?: "media" | "brand" | "trade";
  indexLabel?: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
};

/** monolog-style: name left, massive metric right */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const prefix = project.indexLabel ?? `SS /${String(index + 1).padStart(2, "0")}`;

  return (
    <AnimatedSection delay={index * 0.1}>
      <article
        className={cn(
          "group relative overflow-hidden border border-neutral-800/80 bg-neutral-950/40",
          "transition-colors duration-300 hover:border-neutral-600"
        )}
      >
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:gap-10 md:p-8">
          <div className="min-w-0 max-w-md">
            <p className="mb-3 font-mono text-[11px] tracking-widest text-orange-500/90">
              {prefix}
              {project.comingSoon ? (
                <span className="ml-3 text-neutral-600">COMING SOON</span>
              ) : null}
            </p>
            <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
              {project.tag}
            </p>
            <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {project.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {project.result}
            </p>
          </div>

          <div className="flex shrink-0 items-end justify-between gap-4 md:flex-col md:items-end">
            <p className="font-display text-5xl font-bold tracking-tight text-white transition-transform duration-300 group-hover:scale-105 md:text-6xl lg:text-7xl">
              {project.stat}
            </p>
            <ArrowUpRight
              className="size-5 text-neutral-600 transition-colors group-hover:text-orange-400"
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 0.75px, transparent 0.75px)",
            backgroundSize: "14px 14px",
          }}
          aria-hidden="true"
        />
      </article>
    </AnimatedSection>
  );
}
