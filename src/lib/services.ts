export type ServiceId =
  | "web-design"
  | "branding"
  | "development"
  | "landing-pages"
  | "seo"
  | "ui-product"
  | "content"
  | "ecommerce"
  | "hosting-launch"
  | "strategy"
  | "maintenance"
  | "creative";

export type ServiceCategory = "build" | "grow" | "care" | "special";

export type Service = {
  id: ServiceId;
  name: string;
  detail: string;
  price: string;
  category: ServiceCategory;
  /** Who this service typically serves — broad SMB, not one vertical */
  fits: string[];
};

/**
 * Canonical service menu for marketing + client dashboard.
 * Broad SMB: professional services, retail, hospitality, creators, trades, and more.
 */
export const services: Service[] = [
  {
    id: "web-design",
    name: "Web Design",
    detail:
      "Sites that build trust fast. Clear story, proof, and a path to inquire. Mobile-first and fast for small businesses of any industry.",
    price: "From $500",
    category: "build",
    fits: ["professional services", "trades", "hospitality", "creators"],
  },
  {
    id: "branding",
    name: "Branding",
    detail:
      "Identity systems: logo, type, color. Your site, socials, and materials should feel like one brand.",
    price: "From $350",
    category: "build",
    fits: ["new brands", "rebrands", "studios", "retail"],
  },
  {
    id: "development",
    name: "Development",
    detail:
      "Custom builds when quality matters. Clean code, performance, and hosting that fits. No bloated page builders.",
    price: "With design",
    category: "build",
    fits: ["custom sites", "tools", "performance-critical"],
  },
  {
    id: "landing-pages",
    name: "Landing Pages",
    detail:
      "Focused pages for launches, offers, and campaigns. Designed to convert without clutter.",
    price: "From $400",
    category: "build",
    fits: ["campaigns", "coaches", "product launches"],
  },
  {
    id: "seo",
    name: "SEO",
    detail:
      "Titles, structure, meta, and discoverability basics so the right people can find you. Local or broader.",
    price: "From $200",
    category: "grow",
    fits: ["local business", "service firms", "clinics"],
  },
  {
    id: "ui-product",
    name: "UI / Product",
    detail:
      "Interfaces for tools, apps, and product marketing pages. Clear UI with the same editorial care.",
    price: "Per project",
    category: "build",
    fits: ["SaaS light", "internal tools", "apps"],
  },
  {
    id: "content",
    name: "Content & Copy",
    detail:
      "Homepage narrative, service pages, and CTA language that sounds like you — not generic agency filler.",
    price: "From $250",
    category: "grow",
    fits: ["coaches", "clinics", "consultants", "creators"],
  },
  {
    id: "ecommerce",
    name: "E-commerce Lite",
    detail:
      "Simple product catalogs, checkout-ready pages, and clean merchandising for shops that do not need a megastore.",
    price: "From $800",
    category: "build",
    fits: ["retail", "makers", "studios", "food & beverage"],
  },
  {
    id: "hosting-launch",
    name: "Hosting & Launch",
    detail:
      "Domain, DNS, SSL, and a calm go-live. You get a live URL that works — without the technical headache.",
    price: "From $150",
    category: "care",
    fits: ["first-time sites", "migrations", "rebrands"],
  },
  {
    id: "strategy",
    name: "Strategy Session",
    detail:
      "A focused consult on goals, sitemap, and what to build first. Useful before a full project — or when you are stuck.",
    price: "From $100",
    category: "special",
    fits: ["early stage", "rebrands", "unclear scope"],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    detail:
      "Updates, content tweaks, uptime checks, and small fixes so your site stays sharp after launch.",
    price: "$50 / month",
    category: "care",
    fits: ["ongoing clients", "live sites"],
  },
  {
    id: "creative",
    name: "Creative Direction",
    detail:
      "Mood, motion, and visual systems for brands that want something distinctive — selectively scoped, not a menu default.",
    price: "Per project",
    category: "special",
    fits: ["studios", "hospitality", "personal brands"],
  },
];

export const serviceCount = services.length;

export function getService(id: ServiceId): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getServiceName(id: ServiceId): string {
  return getService(id)?.name ?? id;
}
