import { AsciiDivider } from "@/components/AsciiDivider";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/site";
import { CTA } from "./sections/CTA";
import { Hero } from "./sections/Hero";
import { HomeTeasers } from "./sections/HomeTeasers";
import { Method } from "./sections/Method";

export const metadata = pageMetadata({
  title: "Web Design & Digital Services for Small Businesses",
  description:
    "DasDev designs and builds websites for small businesses and independents. Design, branding, development, SEO, and ongoing care. Based in Florida, working with clients anywhere.",
  path: "/",
});

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <AsciiDivider />
      <HomeTeasers />
      <AsciiDivider />
      <Method />
      <CTA />
      <SiteFooter />
    </main>
  );
}
