import type { ServiceId } from "@/lib/services";

export type ProjectStatus = "live" | "in progress" | "in review" | "queued";

export type DashboardProject = {
  id: string;
  name: string;
  url: string;
  status: ProjectStatus;
  /** Services active on this engagement */
  services: ServiceId[];
  industry: string;
  note?: string;
};

export type DashboardUpdate = {
  id: string;
  text: string;
  done: boolean;
  date: string;
  projectId?: string;
};

export type CarePlan = {
  active: boolean;
  plan: string;
  renews: string;
  included: string[];
};

export type ClientWorkspace = {
  clientId: string;
  businessName: string;
  contactName: string;
  industry: string;
  since: string;
  projects: DashboardProject[];
  updates: DashboardUpdate[];
  care: CarePlan;
  /** Service ids the client has engaged historically or currently */
  engagedServices: ServiceId[];
};

/**
 * Demo workspace for the static client portal scaffold.
 * Replace with real auth + per-client data when a backend lands.
 * Industries stay deliberately broad (not trades-only).
 */
export const demoWorkspace: ClientWorkspace = {
  clientId: "demo-northline",
  businessName: "Northline Studio",
  contactName: "Jordan",
  industry: "Creative studio",
  since: "2026",
  engagedServices: [
    "web-design",
    "branding",
    "content",
    "hosting-launch",
    "maintenance",
  ],
  projects: [
    {
      id: "proj-site",
      name: "Northline marketing site",
      url: "https://example.com/northline",
      status: "live",
      services: ["web-design", "development", "hosting-launch"],
      industry: "Creative studio",
      note: "Primary public site",
    },
    {
      id: "proj-brand",
      name: "Identity refresh",
      url: "#",
      status: "in review",
      services: ["branding", "creative"],
      industry: "Creative studio",
      note: "Logo + type system",
    },
    {
      id: "proj-launch",
      name: "Spring offer landing page",
      url: "#",
      status: "in progress",
      services: ["landing-pages", "content", "seo"],
      industry: "Creative studio",
    },
  ],
  updates: [
    {
      id: "u1",
      text: "Review brand mark options for Identity refresh",
      done: false,
      date: "Jul 25",
      projectId: "proj-brand",
    },
    {
      id: "u2",
      text: "Approve spring offer headline copy",
      done: false,
      date: "Jul 24",
      projectId: "proj-launch",
    },
    {
      id: "u3",
      text: "Launch checklist: DNS + SSL confirmed",
      done: true,
      date: "Jul 18",
      projectId: "proj-site",
    },
  ],
  care: {
    active: true,
    plan: "Maintenance",
    renews: "Aug 1",
    included: [
      "Content tweaks",
      "Uptime checks",
      "Small fixes",
      "Priority reply",
    ],
  },
};

/** Example industries the portal is built to support (marketing + ops). */
export const supportedIndustries = [
  "Professional services",
  "Retail & makers",
  "Restaurants & hospitality",
  "Creators & studios",
  "Trades & home services",
  "Clinics & care",
  "Coaches & consultants",
  "Early startups",
] as const;

export const DASH_AUTH_KEY = "dash_auth";
export const DASH_CLIENT_KEY = "dash_client";

export function projectStatusCounts(projects: DashboardProject[]) {
  const counts = {
    live: 0,
    "in progress": 0,
    "in review": 0,
    queued: 0,
  } satisfies Record<ProjectStatus, number>;

  for (const p of projects) {
    counts[p.status] += 1;
  }

  return counts;
}

export function statusBadgeClass(status: ProjectStatus): string {
  switch (status) {
    case "live":
      return "bg-green-500/10 text-green-400";
    case "in review":
      return "bg-amber-500/10 text-amber-400";
    case "in progress":
      return "bg-sky-500/10 text-sky-400";
    case "queued":
      return "bg-neutral-500/10 text-neutral-400";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
