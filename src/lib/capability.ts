export function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function prefersReducedTransparency() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
}

export function hasCoarsePointer() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(pointer: coarse)").matches;
}

export function canHover() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(hover: hover)").matches;
}
