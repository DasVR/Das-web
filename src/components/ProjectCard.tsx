"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
  /**
   * Depth of the card title in the document outline. Cards listed under a
   * section heading are "h3"; on /work they are the page's top-level sections,
   * so they are "h2".
   */
  headingAs?: "h2" | "h3";
};

const KIND_BADGE: Record<Project["kind"], string> = {
  personal: "PERSONAL",
  client: "CLIENT",
  cta: "OPEN",
};

const CURSOR_LABEL: Record<Project["kind"], string> = {
  personal: "View",
  client: "View",
  cta: "Hire",
};

/** monolog-style row: meta | story | honest label — no fake metrics */
export function ProjectCard({
  project,
  index,
  headingAs: Heading = "h3",
}: ProjectCardProps) {
  const prefix =
    project.indexLabel ?? `SS /${String(index + 1).padStart(2, "0")}`;
  const href = project.href ?? "/contact";
  const isExternal = href.startsWith("http");
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  function onMove(e: MouseEvent) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }

  return (
    <AnimatedSection delay={index * 0.08}>
      <motion.a
        ref={ref}
        href={href}
        data-cursor={CURSOR_LABEL[project.kind]}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        onMouseMove={onMove}
        onMouseLeave={() => setGlow((g) => ({ ...g, active: false }))}
        className={cn(
          "group relative block overflow-hidden border border-neutral-800/80 bg-neutral-950/40",
          "transition-colors duration-300 hover:border-neutral-600"
        )}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, rgba(249,115,22,0.09), transparent 60%)`,
          }}
        />

        {project.image ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-neutral-900 bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.imageAlt ?? project.name}
              className="h-full w-full object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
            />
          </div>
        ) : null}

        <article className="relative grid gap-6 p-6 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-8">
          <div className="font-mono text-[11px] tracking-widest">
            <p className="text-orange-500/90">{prefix}</p>
            <p className="mt-1 text-neutral-600">{KIND_BADGE[project.kind]}</p>
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
              {project.tag}
            </p>
            <Heading className="font-display text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
              {project.name}
            </Heading>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
              {project.result}
            </p>
          </div>

          <div className="flex shrink-0 items-end justify-between gap-4 md:flex-col md:items-end">
            <p className="font-display text-4xl font-bold tracking-tight text-white transition-transform duration-300 group-hover:scale-105 md:text-5xl lg:text-6xl">
              {project.label}
            </p>
            <ArrowUpRight
              className="size-5 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-400"
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
      </motion.a>
    </AnimatedSection>
  );
}
