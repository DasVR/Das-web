"use client";

import { usePathname } from "next/navigation";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScroll } from "@/components/SmoothScroll";

const portalPrefixes = ["/dashboard", "/admin"];

/** Global chrome — once in root layout, not per page */
export function SiteChrome() {
  const pathname = usePathname();

  // Client portal and admin are product surfaces — skip marketing chrome.
  if (portalPrefixes.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  return (
    <>
      <SmoothScroll />
      <GrainOverlay />
      <ScrollProgress />
      <CustomCursor />
      <SiteNav />
    </>
  );
}
