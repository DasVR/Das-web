import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import {
  founderName,
  ogImage,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DasDev. Web Design & Digital Services for Small Businesses",
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "DasDev",
    "Arriq",
    "web design",
    "personal portfolio",
    "small business website",
    "branding",
    "freelance designer",
    "Florida web designer",
  ],
  authors: [{ name: founderName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "DasDev. Websites that speak your brand's voice",
    description:
      "Web design and digital services for small businesses and independents. Starting around $500.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "DasDev. Portfolio & Web Design",
    description:
      "Web design and services for small businesses. Based in Florida, working widely.",
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  // Canonicals are set per page via pageMetadata(); a value here would claim
  // every route is the home page.
  formatDetection: { telephone: false },
  other: {
    "theme-color": "#0a0a0a",
    viewport:
      "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#0a0a0a] font-sans text-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Skip to content
        </a>
        <StructuredData />
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
