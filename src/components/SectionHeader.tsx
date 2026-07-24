"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
  className?: string;
  index?: string;
  title?: string;
  /** Right-rail meta — keeps wide screens from feeling half-empty */
  meta?: ReactNode;
};

/** mainframe: "/ About (01)" + masked title reveal + optional right rail */
export function SectionHeader({
  label,
  className,
  index,
  title,
  meta,
}: SectionHeaderProps) {
  const clean = label.replace(/^\//, "").trim();

  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <div className="flex items-baseline gap-2 font-mono text-sm tracking-wide text-neutral-500 md:text-base">
        <span className="text-orange-500">/</span>
        <h2 className="text-neutral-300">{clean}</h2>
        {index ? <span className="text-neutral-600">({index})</span> : null}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        {title ? (
          <ScrollReveal className="max-w-3xl font-display text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </ScrollReveal>
        ) : (
          <div />
        )}
        {meta ? (
          <div className="flex flex-col gap-1 border-l border-neutral-800 pl-4 font-mono text-[11px] leading-relaxed tracking-wide text-neutral-500 lg:max-w-[16rem] lg:text-right">
            {meta}
          </div>
        ) : null}
      </div>
    </div>
  );
}
