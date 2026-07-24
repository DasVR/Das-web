"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CommitMatrix } from "@/components/CommitMatrix";
import { LANGUAGE_COLORS, relativeTime, type LabRepo } from "@/lib/github";

type RepoCardProps = {
  repo: LabRepo;
  index: number;
};

export function RepoCard({ repo, index }: RepoCardProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  function onMove(e: MouseEvent) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  const langColor = repo.language
    ? LANGUAGE_COLORS[repo.language] ?? "#737373"
    : "#737373";

  return (
    <AnimatedSection delay={index * 0.06}>
      <motion.a
        ref={ref}
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="GitHub"
        onMouseMove={onMove}
        className="group relative flex h-full flex-col overflow-hidden border border-neutral-800/80 bg-neutral-950/40 p-5 transition-colors duration-300 hover:border-neutral-600 md:p-6"
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-orange-500/70 transition-transform duration-500 group-hover:scale-x-100"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${glow.x}% ${glow.y}%, rgba(249,115,22,0.10), transparent 62%)`,
          }}
        />

        <div className="relative mb-4 flex items-start justify-between gap-4">
          <p className="font-mono text-[10px] tracking-widest text-neutral-600">
            {repo.fullName}
          </p>
          <ArrowUpRight
            className="size-4 shrink-0 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-400"
            aria-hidden="true"
          />
        </div>

        <h3 className="relative font-display text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
          {repo.name}
        </h3>

        {repo.description ? (
          <p className="relative mt-2 text-sm leading-relaxed text-neutral-500">
            {repo.description}
          </p>
        ) : null}

        {repo.topics.length > 0 ? (
          <ul className="relative mt-4 flex flex-wrap gap-1.5">
            {repo.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-md border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-500"
              >
                {topic}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="relative mt-auto pt-6">
          {repo.activity.length > 0 ? (
            <div className="mb-4">
              <CommitMatrix activity={repo.activity} />
              <p className="mt-2 font-mono text-[10px] tracking-widest text-neutral-700">
                COMMITS · LAST {repo.activity.length} WEEKS
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 border-t border-neutral-900 pt-4 font-mono text-[11px] text-neutral-500">
            {repo.language ? (
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: langColor }}
                  aria-hidden="true"
                />
                {repo.language}
              </span>
            ) : null}
            {repo.stars > 0 ? (
              <span className="flex items-center gap-1.5">
                <Star className="size-3" aria-hidden="true" />
                {repo.stars}
              </span>
            ) : null}
            {repo.forks > 0 ? (
              <span className="flex items-center gap-1.5">
                <GitFork className="size-3" aria-hidden="true" />
                {repo.forks}
              </span>
            ) : null}
            {repo.pushedAt ? (
              <span className="ml-auto text-neutral-600">
                {relativeTime(repo.pushedAt)}
              </span>
            ) : null}
          </div>
        </div>
      </motion.a>
    </AnimatedSection>
  );
}
