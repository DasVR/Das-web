import {
  absoluteUrl,
  areaServed,
  contactEmail,
  contactPhone,
  founderName,
  foundingYear,
  siteDescription,
  siteName,
  siteUrl,
  socialProfiles,
} from "@/lib/site";
import { services } from "@/lib/services";

const ORG_ID = `${siteUrl}/#organization`;
const FOUNDER_ID = `${siteUrl}/#founder`;
const SITE_ID = `${siteUrl}/#website`;

/**
 * Site-wide JSON-LD graph. Entities are linked by @id so search engines read
 * one connected business rather than three unrelated blobs.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      email: contactEmail,
      telephone: contactPhone,
      foundingDate: foundingYear,
      founder: { "@id": FOUNDER_ID },
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.png"),
        width: 512,
        height: 512,
      },
      image: absoluteUrl("/og.png"),
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Largo",
        addressRegion: "FL",
        addressCountry: "US",
      },
      areaServed: areaServed.map((name) => ({ "@type": "Place", name })),
      sameAs: socialProfiles,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "DasDev services",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.detail,
            serviceType: service.name,
            provider: { "@id": ORG_ID },
          },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: founderName,
      url: absoluteUrl("/about"),
      jobTitle: "Designer and developer",
      worksFor: { "@id": ORG_ID },
      sameAs: socialProfiles,
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      publisher: { "@id": ORG_ID },
      inLanguage: "en-US",
    },
  ];

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

/** Breadcrumb trail for a page one level below the home page. */
export function BreadcrumbJsonLd({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name,
            item: absoluteUrl(path),
          },
        ],
      }}
    />
  );
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Values are authored in this repo, not user input. Escaping "<" keeps a
      // future copy change from being able to break out of the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
