import type { ServiceId } from "@/lib/services";

export type ProjectTemplateId =
  | "website-build"
  | "brand-refresh"
  | "landing-page"
  | "custom";

export type ProjectTemplate = {
  id: ProjectTemplateId;
  label: string;
  description: string;
  services: ServiceId[];
  /** Checklist items created as update rows the moment the project exists. */
  checklist: string[];
};

/**
 * One-click starting points so "+ New project" does not mean retyping the
 * same checklist per client. Picking a template just pre-fills services and
 * queues the checklist as update rows — nothing here is enforced afterwards.
 */
export const projectTemplates: ProjectTemplate[] = [
  {
    id: "website-build",
    label: "Website build",
    description: "Full site from scratch: design, build, and launch.",
    services: ["web-design", "development", "hosting-launch"],
    checklist: [
      "Collect content and brand assets",
      "Share first design draft",
      "Build out pages",
      "Client review",
      "Launch",
    ],
  },
  {
    id: "brand-refresh",
    label: "Brand refresh",
    description: "Logo, colors, and a type system that stays consistent.",
    services: ["branding"],
    checklist: [
      "Discovery call",
      "Concept moodboard",
      "Logo drafts",
      "Final files delivered",
    ],
  },
  {
    id: "landing-page",
    label: "Landing page",
    description: "One page for one offer — a promo, event, or new service.",
    services: ["landing-pages", "content"],
    checklist: [
      "Copy draft",
      "Design draft",
      "Build and connect domain",
      "Launch",
    ],
  },
  {
    id: "custom",
    label: "Custom",
    description: "Start blank — add services and updates as you go.",
    services: [],
    checklist: [],
  },
];

export function getProjectTemplate(id: ProjectTemplateId): ProjectTemplate {
  return (
    projectTemplates.find((template) => template.id === id) ??
    projectTemplates[projectTemplates.length - 1]
  );
}
