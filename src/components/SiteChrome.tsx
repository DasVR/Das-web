"use client";

import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScroll } from "@/components/SmoothScroll";

/** Global chrome — once in root layout, not per page */
export function SiteChrome() {
  return (
    <>
      <SmoothScroll />
      <GrainOverlay />
      <CustomCursor />
      <SiteNav />
    </>
  );
}
