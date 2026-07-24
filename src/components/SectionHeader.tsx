import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Section name without slash, e.g. "Work" */
  label: string;
  className?: string;
  /** Index like "01" → renders "/ Work (01)" */
  index?: string;
  /** Optional larger section title under the slash label */
  title?: string;
};

/** mainframe: "/ About us (01)" */
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
        {index ? (
          <span className="text-neutral-600">({index})</span>
        ) : null}
      </div>
      {title ? (
        <p className="mt-4 max-w-3xl font-serif text-3xl tracking-tight text-white md:text-5xl">
          {title}
        </p>
      ) : null}
    </div>
  );
}
