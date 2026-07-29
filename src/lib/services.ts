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
  fits: string[];
};

/**
 * Service menu for local small business work.
 * Prices are ranges, not starting points. Honest for a teen freelancer.
 */
export const services: Service[] = [
  {
    id: "web-design",
    name: "Web Design",
    detail:
      "Clean sites that get the point across. Mobile-first and fast. Good for trades, cafes, clinics, and anyone who needs to look legit online.",
    price: "$300 – $600",
    category: "build",
    fits: ["trades", "local services", "small shops", "creators"],
  },
  {
    id: "branding",
    name: "Branding",
    detail:
      "Logo, colors, and type that look consistent on a business card, truck, and site. Not overdone, just recognizable.",
    price: "$150 – $300",
    category: "build",
    fits: ["new brands", "rebrands", "contractors", "food trucks"],
  },
  {
    id: "development",
    name: "Development",
    detail:
      "Custom stuff when templates break. Integrations, tools, or weird features that Squarespace cant handle.",
    price: "$200 – $500",
    category: "build",
    fits: ["custom sites", "booking tools", "calculators"],
  },
  {
    id: "landing-pages",
    name: "Landing Pages",
    detail:
      "One page for one offer. A service, a promo, a signup. No fluff, just a clear next step.",
    price: "$150 – $300",
    category: "build",
    fits: ["campaigns", "events", "new services"],
  },
  {
    id: "seo",
    name: "SEO",
    detail:
      "Google Business setup, page titles, and basic structure so people nearby can actually find you.",
    price: "$75 – $150",
    category: "grow",
    fits: ["local business", "trades", "clinics"],
  },
  {
    id: "ui-product",
    name: "UI / Product",
    detail:
      "Interface work for small tools, apps, or dashboards. Clean and usable, not overdesigned.",
    price: "$250 – $500",
    category: "build",
    fits: ["internal tools", "small apps", "forms"],
  },
  {
    id: "content",
    name: "Content & Copy",
    detail:
      "Homepage text, service descriptions, and CTA language that sounds like a human wrote it.",
    price: "$50 – $150",
    category: "grow",
    fits: ["any site that needs words"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    detail:
      "Small product catalogs and checkout for local sellers. Not Shopify bloat, just what you need.",
    price: "$400 – $800",
    category: "build",
    fits: ["local sellers", "makers", "retail"],
  },
  {
    id: "hosting-launch",
    name: "Hosting & Launch",
    detail:
      "Domain, SSL, and getting the thing live. You hand it off, I make sure it works.",
    price: "$10 / mo",
    category: "care",
    fits: ["first-time sites", "migrations"],
  },
  {
    id: "strategy",
    name: "Strategy Session",
    detail:
      "30-60 min call to figure out what to build first and what to skip. Good when you arent sure where to start.",
    price: "$50 – $100",
    category: "special",
    fits: ["new businesses", "unclear scope"],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    detail:
      "Updates, small fixes, and keeping the lights on. Month to month, no contract.",
    price: "$25 / mo",
    category: "care",
    fits: ["live sites", "busy owners"],
  },
  {
    id: "creative",
    name: "Creative Direction",
    detail:
      "Mood, motion, and visual systems for brands that want to stand out. Selectively scoped.",
    price: "$300 – $600",
    category: "special",
    fits: ["studios", "personal brands", "hospitality"],
  },
];

export const serviceCount = services.length;

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getServiceName(id: string): string {
  return getService(id)?.name ?? id;
}
