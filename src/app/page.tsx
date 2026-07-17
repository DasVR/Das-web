"use client";

import { useState } from "react";

import { PortfolioShell } from "@/components/site/portfolio-shell";
import { TextFallback } from "@/components/site/text-fallback";

function isTextMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("text") === "1";
}

export default function Home() {
  const [textMode] = useState(isTextMode);

  if (textMode) {
    return <TextFallback />;
  }

  return <PortfolioShell />;
}
