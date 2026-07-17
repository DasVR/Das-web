"use client";

import { useCallback } from "react";
import { useWebHaptics } from "web-haptics/react";

import { prefersReducedMotion } from "@/lib/capability";

type HapticPreset =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

export function useHaptics() {
  const { isSupported, trigger } = useWebHaptics();

  const pulse = useCallback(
    (preset: HapticPreset) => {
      if (prefersReducedMotion() || !isSupported) {
        return;
      }

      trigger(preset);
    },
    [isSupported, trigger],
  );

  return { isSupported, pulse };
}
