import { BreadcrumbJsonLd } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/site";
import { WorkContent } from "./WorkContent";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Selected DasDev projects and experiments. Honest work for small businesses, with case studies as real projects land.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <BreadcrumbJsonLd name="Work" path="/work" />
      <WorkContent />
    </>
  );
}
