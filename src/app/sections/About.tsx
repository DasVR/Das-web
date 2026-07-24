"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";

export function About() {
  return (
    <section
      id="about"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader label="About" index="02" />

      <div className="grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <AnimatedSection>
          <h3 className="mb-6 font-serif text-3xl leading-tight tracking-tight text-white md:text-5xl">
            Local designer.
            <br />
            <span className="text-neutral-500">Built for trades that need calls, not fluff.</span>
          </h3>
          <div className="flex max-w-xl flex-col gap-4 text-base leading-relaxed text-neutral-400 md:text-lg">
            <p>
              I&apos;m Arriq — Das Web Design. I build fast, clean sites for
              plumbers, HVAC, electricians, and other local businesses in Largo
              and the Tampa Bay area.
            </p>
            <p>
              No page builders. No bloated templates. Just a site that looks
              legit on mobile, loads quick, and makes it easy for someone to call
              you.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <dl className="grid grid-cols-2 gap-6 border border-neutral-800/80 bg-neutral-950/50 p-6 md:p-8">
            {[
              { k: "Based", v: "Largo, FL" },
              { k: "Focus", v: "Local trades" },
              { k: "Projects", v: "$500–$1,500" },
              { k: "Turnaround", v: "~1 week" },
            ].map((item) => (
              <div key={item.k} className="flex flex-col gap-1">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                  {item.k}
                </dt>
                <dd className="font-display text-lg text-neutral-200">{item.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 font-mono text-[11px] tracking-wide text-neutral-700">
            {"// not an agency — just a local builder"}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
