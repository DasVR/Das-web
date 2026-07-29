import { SiteFooter } from "@/components/SiteFooter";
import { Method } from "@/app/sections/Method";
import { Services } from "@/app/sections/Services";
import { CTA } from "@/app/sections/CTA";
import { BreadcrumbJsonLd } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Web design, branding, development, landing pages, SEO, content, e-commerce, hosting, strategy, UI, and maintenance for small businesses.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main id="main" className="min-h-screen pt-16">
      <BreadcrumbJsonLd name="Services" path="/services" />
      <Services />
      <Method />
      <CTA />
      <SiteFooter />
    </main>
  );
}
