import { AsciiDivider } from "@/components/AsciiDivider";
import { SiteFooter } from "@/components/SiteFooter";
import { CTA } from "./sections/CTA";
import { Hero } from "./sections/Hero";
import { HomeTeasers } from "./sections/HomeTeasers";
import { Method } from "./sections/Method";

export default function Home() {
  return (
    <main className="min-h-screen">
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
