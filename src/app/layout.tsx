import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
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

const siteUrl = "https://dasdev.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arriq. Personal Portfolio & Web Design for Small Businesses",
    template: "%s · Arriq",
  },
  description:
    "Personal portfolio and web design for small businesses and independents. Based in Florida, working with clients anywhere.",
  keywords: [
    "Arriq",
    "Das Web Design",
    "personal portfolio",
    "web design",
    "small business website",
    "branding",
    "freelance designer",
    "Florida web designer",
  ],
  authors: [{ name: "Arriq", url: siteUrl }],
  creator: "Arriq",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Arriq. Das Web Design",
    title: "Arriq. Websites that speak your brand's voice",
    description:
      "Personal portfolio and web design for small businesses and independents. Starting around $500.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arriq. Portfolio & Web Design",
    description:
      "Personal portfolio and services for small businesses. Based in Florida, working widely.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    "theme-color": "#0a0a0a",
    "viewport": "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
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
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
