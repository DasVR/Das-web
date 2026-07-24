import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
  className?: string;
};

export function SectionHeader({ label, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-16 flex items-center gap-4", className)}>
      <Crosshair className="h-5 w-5 text-neutral-600" aria-hidden="true" />
      <h2 className="text-sm uppercase tracking-widest text-neutral-500">
        {label}
      </h2>
    </div>
  );
}
