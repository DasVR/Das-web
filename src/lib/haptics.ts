"use client";

import { useEffect, useRef } from "react";

/** iOS Taptic Engine hack — hidden checkbox toggle triggers haptic feedback */
let iosHapticElement: HTMLInputElement | null = null;

function getIosHapticElement(): HTMLInputElement {
  if (iosHapticElement) return iosHapticElement;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.style.position = "absolute";
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  input.style.width = "0";
  input.style.height = "0";
  document.body.appendChild(input);
  iosHapticElement = input;
  return input;
}

/** Detect iOS Safari */
function isIOSSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/.test(ua) &&
    /WebKit/.test(ua) &&
    !/(CriOS|FxiOS|OPiOS|mercury)/.test(ua)
  );
}

/** Detect Android */
function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

/** Cross-platform haptic feedback */
export function triggerHaptic(
  pattern: number | number[] = 10
): void {
  // iOS — use checkbox toggle hack
  if (isIOSSafari()) {
    const input = getIosHapticElement();
    // Rapid toggle triggers Taptic Engine
    input.checked = !input.checked;
    requestAnimationFrame(() => {
      input.checked = !input.checked;
    });
    return;
  }

  // Android — use Vibration API
  if (isAndroid() && typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
    return;
  }

  // Desktop — silent fallback, no haptics available
}

/** Hook for components — auto-detects platform and provides haptic function */
export function useHaptic() {
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = isIOSSafari() || isAndroid();
  }, []);

  return {
    trigger: triggerHaptic,
    isSupported: isMobile.current,
    isIOS: isIOSSafari(),
    isAndroid: isAndroid(),
  };
}

/** Pre-defined haptic patterns */
export const HapticPatterns = {
  /** Light tap — nav links, small buttons */
  light: 8,
  /** Medium tap — CTAs, form submits */
  medium: 12,
  /** Heavy tap — major actions, confirmations */
  heavy: [10, 30, 10] as number[],
  /** Double tap — menu open */
  double: [8, 40, 8] as number[],
  /** Success — form submitted, action complete */
  success: [10, 20, 10, 20, 10] as number[],
  /** Error — validation failed */
  error: [50, 30, 50] as number[],
  /** Selection — picking from list, checkbox */
  selection: 5,
  /** Toggle — switch on/off */
  toggle: [6, 20, 6] as number[],
} as const;

/** Higher-order component wrapper for haptic on click */
export function withHaptic<T extends HTMLElement>(
  handler?: (e: React.MouseEvent<T>) => void,
  pattern: number | number[] = HapticPatterns.light
): (e: React.MouseEvent<T>) => void {
  return (e: React.MouseEvent<T>) => {
    triggerHaptic(pattern);
    handler?.(e);
  };
}
