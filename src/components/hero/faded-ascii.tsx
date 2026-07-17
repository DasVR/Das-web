"use client";

import { motion } from "motion/react";

import { atmosphere } from "@/config/atmosphere";

export function FadedAscii() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 1.4, ease: "easeOut" }}
      className="faded-sign relative overflow-hidden rounded-sm border border-[#d8c99e]/15 bg-[#34372b]/35 px-4 py-5 shadow-[inset_0_0_40px_rgba(0,0,0,0.25)]"
    >
      <span className="absolute top-2 right-3 font-mono text-[0.55rem] tracking-[0.28em] text-[#d8c99e]/30">
        ARCHIVE / 06
      </span>
      <pre className="overflow-hidden font-mono text-[0.55rem] leading-[1.45] tracking-[0.1em] text-[#d8c99e]/58 sm:text-[0.65rem]">
        {atmosphere.heroAscii.join("\n")}
      </pre>
      <div className="moss-edge absolute inset-x-0 bottom-0 h-6" />
    </motion.div>
  );
}
