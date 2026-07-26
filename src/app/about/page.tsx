import { BreadcrumbJsonLd } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/site";
import { AboutContent } from "./AboutContent";

export const metadata = pageMetadata({
  title: "About",
  description:
    "DasDev is founded by Arriq, a Florida-based designer and developer building fast, intentional websites for small businesses and independents.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd name="About" path="/about" />
      <AboutContent />
    </>
  );
}
