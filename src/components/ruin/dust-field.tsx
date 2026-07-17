"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/capability";
import { tempus } from "@/lib/tempus";

type Mote = {
  alpha: number;
  radius: number;
  speed: number;
  sway: number;
  x: number;
  y: number;
};

const MOTE_COUNT = 42;

export function DustField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    let motes: Mote[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: MOTE_COUNT }, () => ({
        alpha: 0.12 + Math.random() * 0.36,
        radius: 0.4 + Math.random() * 1.6,
        speed: 0.04 + Math.random() * 0.14,
        sway: Math.random() * Math.PI * 2,
        x: Math.random() * width,
        y: Math.random() * height,
      }));
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      const phase = time * 0.0002;

      motes.forEach((mote) => {
        mote.y -= mote.speed;
        mote.x += Math.sin(phase + mote.sway) * 0.06;

        if (mote.y < -4) {
          mote.y = height + 4;
          mote.x = Math.random() * width;
        }

        context.beginPath();
        context.fillStyle = `rgba(238, 220, 177, ${mote.alpha})`;
        context.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        context.fill();
      });
    };

    resize();
    render(0);
    window.addEventListener("resize", resize);
    const unsubscribe = prefersReducedMotion()
      ? () => undefined
      : tempus.subscribe(render);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 opacity-70"
    />
  );
}
