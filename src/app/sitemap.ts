import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapRoutes } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Build time is the honest signal available to a static export; there is no
  // CMS or database backing the marketing pages.
  const lastModified = new Date();

  return sitemapRoutes.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
