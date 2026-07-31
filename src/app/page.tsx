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
    "Web design and digital services for small businesses. Design, branding, development, SEO, and ongoing care. Based in Florida.",
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
