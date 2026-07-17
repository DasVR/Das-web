"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/capability";
import { tempus } from "@/lib/tempus";

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DitherPlane() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let reducedMotion = prefersReducedMotion();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = Math.max(window.innerHeight, 720);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      const imageData = context.createImageData(width, height);
      const data = imageData.data;
      const t = reducedMotion ? 0 : time * 0.00018;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const waveA = Math.sin(x * 0.018 + t * 10);
          const waveB = Math.cos(y * 0.022 - t * 7);
          const ripple = Math.sin((x + y) * 0.012 + t * 8);
          const luminance = clamp((waveA + waveB + ripple + 3) / 6, 0, 1);
          const threshold = (BAYER_4X4[y % 4][x % 4] + 0.5) / 16;
          const value = luminance > threshold ? 255 : 22;
          const green = luminance > threshold ? 255 : 70;
          const blue = luminance > threshold ? 210 : 38;
          const alpha = luminance > threshold ? 48 : 18;
          const index = (y * width + x) * 4;

          data[index] = value - 110;
          data[index + 1] = green;
          data[index + 2] = blue;
          data[index + 3] = alpha;
        }
      }

      context.putImageData(imageData, 0, 0);
    };

    resize();
    render(0);
    window.addEventListener("resize", resize);

    const unsubscribe = reducedMotion ? () => undefined : tempus.subscribe(render);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-35 mix-blend-screen"
    />
  );
}
