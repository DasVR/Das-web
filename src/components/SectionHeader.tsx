import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Display label, e.g. "Work" → renders as /Work */
  label: string;
  className?: string;
  /** Optional index like "01" for editorial numbering */
  index?: string;
};

/** mainframe-style slash headers + furo cross/plus accent */
export function SectionHeader({ label, className, index }: SectionHeaderProps) {
  const slashLabel = label.startsWith("/") ? label : `/${label}`;

  return (
    <div className={cn("mb-12 flex items-end justify-between gap-6 md:mb-16", className)}>
      <div className="flex items-center gap-3">
        <Plus className="size-4 text-orange-500/80" aria-hidden="true" />
        <h2 className="font-mono text-sm tracking-wide text-neutral-400 md:text-base">
          {slashLabel}
        </h2>
      </div>
      {index ? (
        <span className="font-mono text-xs tracking-widest text-neutral-700">
          {index}
        </span>
      ) : null}
    </div>
  );
}
