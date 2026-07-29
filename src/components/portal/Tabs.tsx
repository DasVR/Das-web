"use client";

import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  /** Small count badge, e.g. unread messages. Hidden when 0 or undefined. */
  badge?: number;
};

/**
 * Local tab primitive — no new dependency. Used by the admin client hub and
 * both project detail panels to turn one long scroll into sub-sections.
 */
export function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      className="mb-6 -mx-1 flex gap-1 overflow-x-auto border-b border-neutral-900 pb-px scrollbar-hide"
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-xs font-medium transition-colors",
              isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {item.label}
            {typeof item.badge === "number" && item.badge > 0 && (
              <span className="rounded-full bg-orange-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-orange-300">
                {item.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-px bg-white" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}
