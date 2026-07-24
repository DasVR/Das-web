"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NowPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pb-20 pt-32 md:px-12 md:pb-32 md:pt-40 lg:px-24">
        <SectionHeader
          label="Now"
          index="06"
          title="What I'm doing right now."
          meta={
            <>
              <span className="text-neutral-300">Updated July 2026</span>
              <span>Inspired by nownownow.com</span>
            </>
          }
        />

        <p className="mb-10 max-w-xl text-sm text-neutral-500">
          15 · building in public. Updated whenever life changes.
        </p>

        <div className="mt-4 grid max-w-4xl gap-8">
          <AnimatedSection>
            <div className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                BUILDING
              </p>
              <ul className="flex flex-col gap-3 text-base leading-relaxed text-neutral-300">
                <li>
                  Shipping this portfolio — multi-page, spring transitions, honest
                  craft in public
                </li>
                <li>Taking new small-business web projects ($500–$1,500+)</li>
                <li>
                  Planning a digital business card app (AirDrop + NFC) — not shipped
                  yet
                </li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                LISTENING
              </p>
              <p className="text-base leading-relaxed text-neutral-300">
                Nirvana, Foo Fighters, Deftones, Korn — the usual rotation. Ambient /
                cinematic for late-night coding.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <div className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                READING / WATCHING
              </p>
              <ul className="flex flex-col gap-3 text-base leading-relaxed text-neutral-300">
                <li>Dexter (rewatch, always)</li>
                <li>Motion inspo — rauno.me, monolog, mainframe</li>
                <li>Next.js docs and shipping notes</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.16}>
            <div className="border border-neutral-800/80 bg-neutral-950/40 p-6 md:p-8">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
                LOOKING FOR
              </p>
              <p className="text-base leading-relaxed text-neutral-300">
                New small-business projects. Web design, landing pages, brand
                refreshes.{" "}
                <Link href="/contact" className="text-orange-400 hover:underline">
                  Start a project →
                </Link>
              </p>
            </div>
          </AnimatedSection>
        </div>

        <p className="mt-10 text-sm text-neutral-600">
          Inspired by{" "}
          <a
            href="https://nownownow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-orange-400"
          >
            nownownow.com
          </a>
          .
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
