import { statusBadgeClass, statusClientLabel } from "@/lib/dashboard";
import type { ProjectStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";

/**
 * One badge, two vocabularies: admins see the internal status word, clients
 * see plain language ("Waiting on your OK" instead of "in review").
 */
export function StatusBadge({
  status,
  audience = "admin",
  className,
}: {
  status: ProjectStatus;
  audience?: "admin" | "client";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "w-fit flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        statusBadgeClass(status),
        className
      )}
    >
      {audience === "client" ? statusClientLabel(status) : status}
    </span>
  );
}
