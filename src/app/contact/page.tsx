"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Phone, Github } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { SectionHeader } from "@/components/SectionHeader";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <GrainOverlay />
      <CustomCursor />
      <SiteNav />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <section className="px-6 pt-32 pb-20 md:px-12 md:pt-40 md:pb-32 lg:px-24">
          <SectionHeader
            label="Contact"
            index="05"
            title="Tell me your story."
          />

          <div className="grid max-w-5xl gap-12 mt-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-md border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-orange-400">
                  <span className="size-1.5 rounded-full bg-orange-400" aria-hidden="true" />
                  TAKING NEW PROJECTS
                </span>
                <span className="font-mono text-[10px] tracking-widest text-neutral-600">
                  USUALLY REPLY WITHIN 24H
                </span>
              </div>

              <p className="mb-3 font-mono text-xs tracking-widest text-orange-500/80">
                $ open inbox — hello@dasdev.net
              </p>

              <h3 className="mb-6 font-display text-3xl font-bold tracking-tight md:mb-8 md:text-5xl">
                Ready when you are.
              </h3>

              <div className="flex flex-col gap-4">
                <a
                  href="mailto:hello@dasdev.net"
                  className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
                >
                  <Mail className="size-5" />
                  hello@dasdev.net
                </a>
                <a
                  href="tel:727-507-1194"
                  className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
                >
                  <Phone className="size-5" />
                  (727) 507-1194
                </a>
                <a
                  href="https://github.com/DasVR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
                >
                  <Github className="size-5" />
                  github.com/DasVR
                </a>
              </div>

              <p className="mt-10 text-sm leading-relaxed text-neutral-600 md:mt-12">
                Based in Florida · working with clients wherever you are. Typical
                projects: $500–$1,500+.
              </p>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <form
                action="/api/contact"
                method="POST"
                className="flex flex-col gap-4 border border-neutral-800/80 bg-neutral-950/40 p-5 md:p-6"
              >
                <p className="font-mono text-[10px] tracking-widest text-neutral-600">
                  NEW_MESSAGE
                </p>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs tracking-widest text-neutral-500"
                  >
                    NAME
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs tracking-widest text-neutral-500"
                  >
                    EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@business.com"
                    className="w-full rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs tracking-widest text-neutral-500"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell me about your business and what you need."
                    className="w-full resize-y rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 self-start rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                >
                  Send message
                  <ArrowUpRight className="size-4" />
                </button>

                <p className="text-xs text-neutral-600">
                  Or email directly:{" "}
                  <a
                    href="mailto:hello@dasdev.net"
                    className="text-neutral-400 hover:text-orange-400"
                  >
                    hello@dasdev.net
                  </a>
                </p>
              </form>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
