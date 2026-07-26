import { BreadcrumbJsonLd } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/site";
import { ContactContent } from "./ContactContent";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a project with DasDev. Email hello@dasdev.net or send a note about your business. Replies within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd name="Contact" path="/contact" />
      <ContactContent />
    </>
  );
}
