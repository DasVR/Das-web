import { cn } from "@/lib/utils";

type AsciiDividerProps = {
  className?: string;
};

/** Subtle ASCII/dot divider between sections — research Easter egg */
export function AsciiDivider({ className }: AsciiDividerProps) {
  return (
    <div
      className={cn(
        "flex select-none items-center justify-center px-6 py-2 text-neutral-800 md:px-12 lg:px-24",
        className
      )}
      aria-hidden="true"
    >
      <pre className="overflow-hidden font-mono text-[10px] leading-none tracking-[0.35em] text-neutral-400 md:text-xs">
        · · · + · · · + · · · + · · ·
      </pre>
    </div>
  );
}
