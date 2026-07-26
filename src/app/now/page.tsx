import { BreadcrumbJsonLd } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/site";
import { NowContent } from "./NowContent";

export const metadata = pageMetadata({
  title: "Now",
  description:
    "What DasDev is working on right now: current projects, availability for new work, and what is next.",
  path: "/now",
});

export default function NowPage() {
  return (
    <>
      <BreadcrumbJsonLd name="Now" path="/now" />
      <NowContent />
    </>
  );
}
