import type { MetadataRoute } from "next";
import { absoluteUrl, privatePaths } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No trailing slash: "/dashboard/" would leave /dashboard itself and
        // the /dashboard.txt RSC payload crawlable. As a bare prefix this
        // covers the route, its children, and the payloads beside them.
        disallow: privatePaths,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
