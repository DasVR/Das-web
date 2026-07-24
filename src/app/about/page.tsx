"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

const tools = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "Figma",
  "Git",
  "Cloudflare",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pb-20 pt-32 md:px-12 md:pb-32 md:pt-40 lg:px-24">
        <SectionHeader
          label="About"
          index="02"
          title="Designer & builder. Personal work, client work, clear services."
          meta={
            <>
              <span className="text-neutral-300">Arriq · 15</span>
              <span>Building since 2024</span>
              <span>Florida · remote-friendly</span>
            </>
          }
        />

        <div className="mt-4 grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <AnimatedSection>
            <div className="flex max-w-xl flex-col gap-4 text-base leading-relaxed text-neutral-400 md:text-lg">
              <p>
                I&apos;m Arriq — 15, building in public. This site is my portfolio
                and the front door to Das Web Design. I care about taste, speed,
                and sites that feel like the people behind them.
              </p>
              <p>
                I work with small businesses and independents across industries —
                consultants, shops, hospitality, creators, service businesses, and
                more. If you need a presence that looks legit and gets inquiries,
                that&apos;s the work.
              </p>
              <p>
                Based in Florida. Happy to collaborate remotely. No page-builder
                bloat — just clean design and code you can grow with.
              </p>
            </div>

            <div className="mt-10 border-t border-neutral-900 pt-8">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                NOW
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
                Shipping this multi-page portfolio, taking new small-business
                projects, and expanding the lab.{" "}
                <Link href="/now" className="text-orange-400 hover:underline">
                  See /now →
                </Link>
              </p>
            </div>

            <div className="mt-8 border-t border-neutral-900 pt-8">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-neutral-600">
                PREVIOUSLY
              </p>
              <ul className="flex max-w-xl flex-col gap-3 text-sm leading-relaxed text-neutral-400">
                <li>Started designing & building for the web at 13</li>
                <li>First client work around 14 — learning by shipping</li>
                <li>Now 15 · taking the craft and the business seriously</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <dl className="grid grid-cols-2 gap-6 border border-neutral-800/80 bg-neutral-950/50 p-6 md:p-8">
              {[
                { k: "Based", v: "Florida, USA" },
                { k: "Reach", v: "Clients anywhere" },
                { k: "Focus", v: "Small business" },
                { k: "Projects", v: "$500–$1,500+" },
              ].map((item) => (
                <div key={item.k} className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                    {item.k}
                  </dt>
                  <dd className="font-display text-lg text-neutral-200">
                    {item.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-neutral-600">
                TOOLS
              </p>
              <ul className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-md border border-neutral-800 px-2.5 py-1 font-mono text-[11px] text-neutral-400"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
