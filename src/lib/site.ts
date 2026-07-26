import type { Metadata } from "next";

export const siteUrl = "https://dasdev.net";
export const siteName = "DasDev";
export const founderName = "Arriq";
export const contactEmail = "hello@dasdev.net";
export const contactPhone = "+1-727-507-1194";
export const foundingYear = "2024";

export const siteDescription =
  "DasDev — web design and digital services for small businesses and independents. Based in Florida, working with clients anywhere.";

export const areaServed = ["Largo", "Tampa Bay", "Florida", "United States"];

export const socialProfiles = ["https://github.com/DasVR"];

/** OG image is a static asset: dynamic ImageResponse needs a runtime, and this site is a static export. */
export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "DasDev — web design and digital services for small businesses",
};

type SitemapRoute = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

/**
 * Routes that belong in sitemap.xml. Portal routes (/dashboard, /admin) and
 * thin lab demos are deliberately absent.
 */
export const sitemapRoutes: SitemapRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lab", changeFrequency: "weekly", priority: 0.6 },
  { path: "/now", changeFrequency: "weekly", priority: 0.5 },
];

/** Paths crawlers must never index, and which nginx also serves as noindex. */
export const privatePaths = ["/dashboard", "/admin"];

export function absoluteUrl(path: string): string {
  if (path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Thin or utility pages stay crawlable but out of the index. */
  noIndex?: boolean;
};

/**
 * Per-page metadata with a correct canonical. The root layout cannot supply
 * canonicals because a single value there would claim every page is the home
 * page.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName,
      title: `${title} · ${siteName}`,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteName}`,
      description,
      images: [ogImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
