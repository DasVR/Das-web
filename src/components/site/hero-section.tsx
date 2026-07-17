"use client";

import { motion } from "motion/react";

import { FadedAscii } from "@/components/hero/faded-ascii";
import { Vine } from "@/components/ruin/vine";
import { atmosphere } from "@/config/atmosphere";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 pt-24 pb-14 sm:px-8 lg:px-14">
      <div aria-hidden="true" className="light-shaft absolute -top-24 left-[46%] h-[120%] w-[36rem] -rotate-12" />
      <div aria-hidden="true" className="ruin-wall absolute inset-y-0 right-0 w-[46%] opacity-75" />
      <Vine className="absolute -top-10 right-2 z-10 h-[38rem] w-48 text-[#68784d]/70" />
      <Vine flip className="absolute top-[44%] -left-10 z-10 h-[28rem] w-36 text-[#53613f]/55" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-9rem)] max-w-[88rem] items-end gap-8 lg:grid-cols-[1.18fr_0.82fr]">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="pb-4 lg:pb-16"
        >
          <p className="text-[0.68rem] uppercase tracking-[0.38em] text-[#d8c99e]/70">
            Creative developer · atmospheric design
          </p>
          <h1 className="mt-7 max-w-4xl font-serif text-[clamp(3.7rem,8.5vw,8.5rem)] leading-[0.87] tracking-[-0.055em] text-[#eee9dc]">
            Beautiful things
            <span className="block pl-[8vw] text-[#aab18a] italic">grow back.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-[#c5c0b2] sm:text-lg">
            A portfolio built like an abandoned room after rain—soft light on old
            surfaces, nature at the edges, and careful details waiting to be found.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#cdc5b2]/75">
            {atmosphere.skills.map((skill) => (
              <span key={skill} className="border-b border-[#d8c99e]/25 pb-1">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="relative pb-2 lg:pb-20">
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="ruin-window relative min-h-[31rem] overflow-hidden rounded-[0.4rem_3rem_0.4rem_2rem] border border-white/14 p-5 shadow-[0_35px_90px_rgba(5,8,4,0.42)] sm:p-7"
          >
            <div className="window-refraction absolute inset-0" />
            <div className="window-landscape absolute inset-4 overflow-hidden rounded-[0.2rem_2.2rem_0.2rem_1.5rem]">
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(229,215,177,0.38),transparent_35%),radial-gradient(circle_at_72%_30%,rgba(220,211,170,0.3),transparent_22%),linear-gradient(180deg,#65715b_0%,#3f4938_43%,#252a21_100%)]" />
              <div className="broken-frame absolute inset-y-0 left-[37%] w-px bg-[#292c24]/80" />
              <div className="broken-frame absolute inset-x-0 top-[42%] h-px bg-[#292c24]/70" />
              <div className="absolute right-[8%] bottom-0 h-[72%] w-[34%] bg-[linear-gradient(100deg,transparent,rgba(26,31,23,0.66))] [clip-path:polygon(30%_0,100%_10%,100%_100%,0_100%)]" />
              <div className="grass-line absolute inset-x-0 bottom-0 h-28" />
            </div>
            <div className="relative z-10 flex h-full min-h-[27rem] flex-col justify-between">
              <div className="flex justify-end">
                <span className="rounded-full border border-white/14 bg-[#e6dfcc]/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.3em] text-[#ede5d1]/65 backdrop-blur-xl">
                  room study / 01
                </span>
              </div>
              <FadedAscii />
            </div>
            <Vine className="absolute -top-24 -right-4 h-[31rem] w-36 text-[#718050]/75" />
          </motion.div>
          <p className="mt-4 max-w-sm text-xs leading-6 text-[#aaa696]">
            Frosted glass holds the light; faded data becomes a sign slowly
            overtaken by growth.
          </p>
        </div>
      </div>

      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 text-[0.62rem] uppercase tracking-[0.36em] text-[#d8c99e]/50"
      >
        descend into the ruin
      </motion.a>
    </section>
  );
}
