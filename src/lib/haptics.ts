"use client";

import { useEffect, useRef, useCallback } from "react";

/** iOS Safari user-agent detection */
export function isIOSSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/.test(ua) &&
    /WebKit/.test(ua) &&
    !/(CriOS|FxiOS|OPiOS|mercury)/.test(ua)
  );
}

/** Android detection */
export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

/** Whether this device supports any haptic feedback */
export function supportsHaptics(): boolean {
  if (typeof window === "undefined") return false;
  return isIOSSafari() || (isAndroid() && "vibrate" in navigator);
}

/**
 * iOS overlay haptic system.
 *
 * iOS 26.5+ patched programmatic checkbox toggling.
 * The ONLY way to trigger Taptic Engine from web now is:
 *   1. Create an <input type="checkbox" switch>
 *   2. Overlay it on top of the interactive element
 *   3. User physically taps it -> native haptic fires automatically
 *   4. We handle the change event and forward to the real button
 */
const overlayRegistry = new WeakMap<HTMLElement, HTMLInputElement>();

function createIOSSwitchOverlay(target: HTMLElement): HTMLInputElement {
  const switchEl = document.createElement("input");
  switchEl.type = "checkbox";
  switchEl.setAttribute("switch", ""); // iOS native switch = haptic on tap
  switchEl.setAttribute("aria-hidden", "true");
  switchEl.tabIndex = -1;

  Object.assign(switchEl.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    margin: "0",
    opacity: "0",
    clipPath: "inset(0 round 999px)",
    touchAction: "manipulation",
    cursor: "pointer",
    zIndex: "9999",
  });

  switchEl.style.setProperty("-webkit-tap-highlight-color", "transparent");

  // Ensure parent can contain absolute child
  const computed = getComputedStyle(target);
  if (computed.position === "static") {
    target.style.position = "relative";
  }

  target.appendChild(switchEl);
  overlayRegistry.set(target, switchEl);

  return switchEl;
}

function removeIOSSwitchOverlay(target: HTMLElement) {
  const existing = overlayRegistry.get(target);
  if (existing) {
    existing.remove();
    overlayRegistry.delete(target);
  }
}

/** Attach iOS haptic overlay to a DOM element. Returns cleanup function. */
export function attachHapticOverlay(
  target: HTMLElement | null,
  onActivate?: () => void
): () => void {
  if (!target || !isIOSSafari()) return () => {};

  // Remove any existing overlay first
  removeIOSSwitchOverlay(target);

  const switchEl = createIOSSwitchOverlay(target);

  const handleChange = () => {
    // Reset checkbox immediately
    switchEl.checked = false;
    // Forward to actual handler
    onActivate?.();
  };

  const handleClick = (e: Event) => {
    // Prevent the switch click from bubbling to avoid double-fires
    e.stopPropagation();
  };

  switchEl.addEventListener("change", handleChange);
  switchEl.addEventListener("click", handleClick);

  return () => {
    switchEl.removeEventListener("change", handleChange);
    switchEl.removeEventListener("click", handleClick);
    removeIOSSwitchOverlay(target);
  };
}

/** Hook: attach iOS haptic overlay to a ref'd element */
export function useHapticOverlay<T extends HTMLElement>(
  onActivate?: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    return attachHapticOverlay(ref.current, onActivate);
  }, [onActivate]);

  return ref;
}

/** Legacy cross-platform trigger (Android + desktop fallback) */
export function triggerHaptic(
  pattern: number | number[] = 10
): void {
  // iOS — overlays handle haptics automatically via native switch.
  // This function is a no-op on iOS; real haptics come from the overlay.
  if (isIOSSafari()) return;

  // Android — Vibration API
  if (isAndroid() && typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
    return;
  }

  // Desktop — silent fallback
}

/** Hook: detect platform + provide helpers */
export function useHaptic() {
  const state = useRef({
    ios: false,
    android: false,
    supported: false,
  });

  useEffect(() => {
    state.current = {
      ios: isIOSSafari(),
      android: isAndroid(),
      supported: supportsHaptics(),
    };
  }, []);

  return {
    trigger: triggerHaptic,
    isSupported: state.current.supported,
    isIOS: state.current.ios,
    isAndroid: state.current.android,
  };
}

/** Pre-defined haptic patterns (Android / Vibration API values) */
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

/** Higher-order handler: legacy non-overlay tap (Android/desktop only) */
export function withHaptic<T extends HTMLElement>(
  handler?: (e: React.MouseEvent<T>) => void,
  pattern: number | number[] = HapticPatterns.light
): (e: React.MouseEvent<T>) => void {
  return (e: React.MouseEvent<T>) => {
    triggerHaptic(pattern);
    handler?.(e);
  };
}
