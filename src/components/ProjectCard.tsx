"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const KIND_BADGE: Record<Project["kind"], string> = {
  personal: "PERSONAL",
  client: "CLIENT",
  cta: "OPEN",
};

/** monolog-style: name left, honest label right — no fake metrics */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const prefix =
    project.indexLabel ?? `SS /${String(index + 1).padStart(2, "0")}`;
  const href = project.href ?? "#contact";
  const isExternal = href.startsWith("http");

  return (
    <AnimatedSection delay={index * 0.1}>
      <a
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={cn(
          "group relative block overflow-hidden border border-neutral-800/80 bg-neutral-950/40",
          "transition-colors duration-300 hover:border-neutral-600"
        )}
      >
        <article className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:gap-10 md:p-8">
          <div className="min-w-0 max-w-md">
            <p className="mb-3 font-mono text-[11px] tracking-widest text-orange-500/90">
              {prefix}
              <span className="ml-3 text-neutral-600">
                {KIND_BADGE[project.kind]}
              </span>
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
            <p className="font-display text-4xl font-bold tracking-tight text-white transition-transform duration-300 group-hover:scale-105 md:text-5xl lg:text-6xl">
              {project.label}
            </p>
            <ArrowUpRight
              className="size-5 text-neutral-600 transition-colors group-hover:text-orange-400"
              aria-hidden="true"
            />
          </div>
        </article>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 0.75px, transparent 0.75px)",
            backgroundSize: "14px 14px",
          }}
          aria-hidden="true"
        />
      </a>
    </AnimatedSection>
  );
}
