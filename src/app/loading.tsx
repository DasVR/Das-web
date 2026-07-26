"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-10 w-48 md:h-14 md:w-64">
          <DotMatrixLoading />
        </div>

        <div className="w-32 overflow-hidden rounded-full bg-neutral-900 md:w-40">
          <motion.div
            className="h-px bg-orange-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.1, 0.25, 1],
              repeat: Infinity,
            }}
          />
        </div>

        <p className="font-mono text-[10px] tracking-widest text-neutral-600">
          LOADING
        </p>
      </motion.div>
    </div>
  );
}

function DotMatrixLoading() {
  const letters = [
    // D
    [
      "█████·",
      "██··██",
      "██··██",
      "██··██",
      "██··██",
      "██··██",
      "█████·",
    ],
    // A
    [
      "·████·",
      "██··██",
      "██··██",
      "██████",
      "██··██",
      "██··██",
      "██··██",
    ],
    // S
    [
      "·█████",
      "██····",
      "██····",
      "·████·",
      "····██",
      "····██",
      "█████·",
    ],
    // D
    [
      "█████·",
      "██··██",
      "██··██",
      "██··██",
      "██··██",
      "██··██",
      "█████·",
    ],
    // E
    [
      "██████",
      "██····",
      "██····",
      "█████·",
      "██····",
      "██····",
      "██████",
    ],
    // V
    [
      "██··██",
      "██··██",
      "██··██",
      "██··██",
      "██··██",
      "·████·",
      "··██··",
    ],
  ];

  return (
    <div className="flex gap-1.5 md:gap-2">
      {letters.map((letter, li) => (
        <div key={li} className="flex flex-col gap-[2px]">
          {letter.map((row, ri) => (
            <div key={ri} className="flex gap-[2px]">
              {row.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  className={`block h-[3px] w-[3px] rounded-full md:h-[4px] md:w-[4px] ${
                    char === "█" ? "bg-white" : "bg-transparent"
                  }`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: char === "█" ? [0.3, 1, 0.3] : 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: li * 0.08 + ci * 0.04,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
