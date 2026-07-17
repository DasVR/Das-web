"use client";

import { motion } from "motion/react";

import { atmosphere } from "@/config/atmosphere";
import { AsciiSignal } from "@/components/site/ascii-signal";
import { PlaylistRail } from "@/components/site/playlist-rail";

function DitherDots() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(109,255,176,0.22)_0.8px,transparent_0.8px)] [background-size:14px_14px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_82%)]"
    />
  );
}

function VinylCluster() {
  return (
    <div className="relative h-44 w-full">
      <div className="vinyl-record absolute top-4 left-0 size-28 animate-spin-slow opacity-90" />
      <div className="vinyl-record absolute top-16 left-20 size-36 animate-[spin_12s_linear_infinite_reverse] opacity-80" />
      <div className="vinyl-record absolute top-0 right-8 size-20 animate-spin-slow opacity-60" />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative grid min-h-screen items-center gap-8 px-4 pt-28 pb-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="terminal-card liquid-panel relative overflow-hidden p-6 sm:p-8"
        >
          <DitherDots />
          <div className="relative z-10">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.32em] text-[#86d7aa]">
              terminal portfolio / dark liminal cyber
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#84ffc9]/16 bg-white/8 px-3 py-1 font-mono text-xs text-[#d4ffe5]">
                boot sequence
              </span>
              <span className="rounded-full border border-[#84ffc9]/16 bg-white/8 px-3 py-1 font-mono text-xs text-[#d4ffe5]">
                liquid shell
              </span>
              <span className="rounded-full border border-[#84ffc9]/16 bg-white/8 px-3 py-1 font-mono text-xs text-[#d4ffe5]">
                ascii transmission
              </span>
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-[#eefff5] sm:text-6xl lg:text-7xl">
              A hand-built terminal world softened by liquid glass, scanlines, and
              cinematic silence.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#a5c6b5] sm:text-lg">
              This portfolio treats the interface like photography: composition,
              negative space, glow, texture, and restraint first. Terminal DNA stays
              intact, but the surfaces bend light now.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <AsciiSignal className="min-h-[13rem]" />
              <div className="terminal-card liquid-panel relative min-h-[13rem] overflow-hidden p-5">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,255,176,0.16),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(213,168,92,0.18),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.1),transparent_24%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_30%,transparent_60%)]" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#86d7aa]">
                      liquid glass / hero field
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[#cce9d9]">
                      Refractive typography, holographic edge blooms, and dithered
                      motion are confined to the hero so the page stays premium, not noisy.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {atmosphere.skills.map((skill) => (
                      <div
                        key={skill}
                        className="rounded-2xl border border-white/10 bg-black/12 px-3 py-3 font-mono text-xs text-[#dbffea]"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative flex flex-col gap-6">
        <div className="terminal-card liquid-panel relative overflow-hidden p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_38%),radial-gradient(circle_at_40%_40%,rgba(109,255,176,0.18),transparent_22%),radial-gradient(circle_at_70%_60%,rgba(110,130,255,0.12),transparent_24%)]" />
          <div className="relative z-10">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#86d7aa]">
              liminal playback
            </p>
            <p className="mt-2 max-w-sm text-sm leading-7 text-[#cce9d9]">
              Floating vinyl records act like soft physical anchors inside the hero.
              They make the playlist feel tactile instead of tacked on.
            </p>
            <VinylCluster />
          </div>
        </div>

        <PlaylistRail />
      </div>
    </section>
  );
}
