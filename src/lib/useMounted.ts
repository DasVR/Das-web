"use client";

import { useEffect, useState } from "react";

/**
 * False during the server render and the first client render, true afterwards.
 *
 * Use this to gate anything that depends on browser-only state — media queries,
 * viewport position, storage. Branching on such state while hydrating makes the
 * first client render disagree with the prerendered HTML, and React responds by
 * throwing away the server output and re-rendering the entire root.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
