"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
  className?: string;
  index?: string;
  title?: string;
};

/** mainframe: "/ About (01)" + scroll title reveal */
export function SectionHeader({
  label,
  className,
  index,
  title,
}: SectionHeaderProps) {
  const clean = label.replace(/^\//, "").trim();

  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <div className="flex items-baseline gap-2 font-mono text-sm tracking-wide text-neutral-500 md:text-base">
        <span className="text-orange-500">/</span>
        <h2 className="text-neutral-300">{clean}</h2>
        {index ? <span className="text-neutral-600">({index})</span> : null}
      </div>
      {title ? (
        <ScrollReveal className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </ScrollReveal>
      ) : null}
    </div>
  );
}
