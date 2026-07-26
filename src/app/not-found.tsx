"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GrainOverlay } from "@/components/GrainOverlay";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white px-6">
      <GrainOverlay />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
          mass: 1,
        }}
      >
        {/* Giant 404 */}
        <motion.h1
          className="font-display text-[8rem] font-bold leading-none tracking-tighter text-neutral-800 md:text-[12rem] lg:text-[16rem]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1.2,
            delay: 0.1,
          }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="mb-2 font-mono text-xs tracking-widest text-orange-500/80">
            PAGE_NOT_FOUND
          </p>

          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            This page doesn&apos;t exist.
          </h2>

          <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400">
            Maybe it moved, maybe it was never here. Either way, let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              <ArrowLeft className="size-4" />
              Back home
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
            >
              View work
            </Link>
          </div>
        </motion.div>

        {/* Floating dots decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-neutral-800"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
