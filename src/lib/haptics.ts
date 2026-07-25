"use client";

// Polyfill: patches navigator.vibrate() to work on iOS Safari
import "ios-vibrator-pro-max";

/** Trigger haptic feedback. Works on iOS (via polyfill) and Android (native). */
export function triggerHaptic(pattern: number | number[] = 10): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;

  // Defer to let the click event bubble to the polyfill's window listener first.
  // The polyfill needs the trusted event "grant" before it can fire haptics.
  queueMicrotask(() => {
    navigator.vibrate(pattern);
  });
}

/** Pre-defined haptic patterns */
export const HapticPatterns = {
  light: 8,
  medium: 12,
  heavy: [10, 30, 10] as number[],
  double: [8, 40, 8] as number[],
  success: [10, 20, 10, 20, 10] as number[],
  error: [50, 30, 50] as number[],
  selection: 5,
  toggle: [6, 20, 6] as number[],
} as const;
