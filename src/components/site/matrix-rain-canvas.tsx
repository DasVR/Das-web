"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/capability";

const GLYPHS = "01$#*+-<>/:;[]{}";

export function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let columns: number[] = [];

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columnCount = Math.ceil(innerWidth / 18);
      columns = Array.from({ length: columnCount }, () =>
        Math.floor(Math.random() * innerHeight),
      );
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      context.fillStyle = "rgba(3, 10, 8, 0.07)";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(109, 255, 176, 0.38)";
      context.font = "13px var(--font-geist-mono), monospace";

      columns.forEach((drop, columnIndex) => {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = columnIndex * 18;
        const y = drop;

        context.fillText(glyph, x, y);
        columns[columnIndex] =
          y > height + Math.random() * 1200 ? 0 : y + 15 + Math.random() * 4;
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-45"
    />
  );
}
