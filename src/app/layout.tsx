import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
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
    default: "Arriq — Web Design for Small Businesses in Largo, FL",
    template: "%s · Arriq",
  },
  description:
    "Das Web Design by Arriq. Fast, modern websites for plumbers, HVAC, electricians, and local trades in Largo, Florida. Projects typically $500–$1,500.",
  keywords: [
    "web design Largo FL",
    "small business website",
    "plumber website",
    "HVAC website",
    "Das Web Design",
    "Arriq",
  ],
  authors: [{ name: "Arriq", url: siteUrl }],
  creator: "Arriq",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Arriq — Das Web Design",
    title: "Arriq — Websites that speak your brand's voice",
    description:
      "Web design for small businesses in Largo, Florida. Fast, clean sites that convert — starting at $500.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arriq — Web Design",
    description:
      "Web design for small businesses in Largo, Florida. Starting at $500.",
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
