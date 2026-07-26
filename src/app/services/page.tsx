import { SiteFooter } from "@/components/SiteFooter";
import { Method } from "@/app/sections/Method";
import { Services } from "@/app/sections/Services";
import { CTA } from "@/app/sections/CTA";

export const metadata = {
  title: "Services",
  description:
    "Web design, branding, development, landing pages, SEO, content, e-commerce, hosting, strategy, UI, and maintenance for small businesses — starting around $500.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-16">
      <Services />
      <Method />
      <CTA />
      <SiteFooter />
    </main>
  );
}
