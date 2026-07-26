"use client";

import { usePathname } from "next/navigation";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScroll } from "@/components/SmoothScroll";

/** Global chrome — once in root layout, not per page */
export function SiteChrome() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  // Client portal is a product surface — skip marketing chrome.
  if (isDashboard) {
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
