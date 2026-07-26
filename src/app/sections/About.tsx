"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";

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

export function About() {
  return (
    <section
      id="about"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader
        label="About"
        index="02"
        title="Designer & builder. Personal work, client work, clear services."
      />

      <div className="grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <AnimatedSection>
          <div className="flex max-w-xl flex-col gap-4 text-base leading-relaxed text-neutral-400 md:text-lg">
            <p>
              I&apos;m Arriq — this site is my portfolio and the front door to
              DasDev. I care about taste, speed, and sites that feel
              like the people behind them.
            </p>
            <p>
              I work with small businesses and independents across industries:
              consultants, shops, hospitality, creators, service businesses, and
              more. If you need a presence that looks legit and gets inquiries,
              that&apos;s the work.
            </p>
            <p>
              Based in Florida. Happy to collaborate remotely. No page-builder
              bloat. Just clean design and code you can grow with.
            </p>
          </div>

          <div className="mt-10 border-t border-neutral-900 pt-8">
            <p className="mb-3 font-mono text-[10px] tracking-widest text-orange-500/80">
              NOW
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
              Shipping this portfolio in public, taking new small-business
              projects, and expanding the experiments lab (motion, type, and
              interaction studies).
            </p>
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
                <dd className="font-display text-lg text-neutral-200">{item.v}</dd>
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

          <p className="mt-4 font-mono text-[11px] tracking-wide text-neutral-700">
            {"// personal brand · portfolio · services"}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
