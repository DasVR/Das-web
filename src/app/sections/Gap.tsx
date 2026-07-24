"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";

const floaters = [
  { label: "Studio", top: "8%", left: "62%", rotate: "-6deg" },
  { label: "Retail", top: "38%", left: "78%", rotate: "4deg" },
  { label: "Services", top: "58%", left: "58%", rotate: "-3deg" },
] as const;

export function Gap() {
  return (
    <section
      id="gap"
      className="relative overflow-hidden border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader label="The Gap" index="00" />

      <div className="relative grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <AnimatedSection>
          <h3 className="max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Your website is where people decide if you&apos;re{" "}
            <span className="text-neutral-400">worth their time.</span>
          </h3>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
            Most small businesses have built something real — but their site
            doesn&apos;t show it yet. That gap costs more than customers. It costs
            the certainty that your brand is finally being understood.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-500 md:text-lg">
            I help close that gap: positioning, design, and build — so visitors
            feel the quality of your work before they read another word.
          </p>
        </AnimatedSection>

        <div className="relative hidden min-h-[320px] lg:block" aria-hidden="true">
          {floaters.map((item) => (
            <div
              key={item.label}
              className="absolute aspect-[4/3] w-40 border border-neutral-800 bg-gradient-to-br from-neutral-900 to-[#0a0a0a] p-4"
              style={{
                top: item.top,
                left: item.left,
                transform: `rotate(${item.rotate})`,
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #fff 0.6px, transparent 0.6px)",
                  backgroundSize: "10px 10px",
                }}
              />
              <p className="relative font-mono text-[10px] tracking-widest text-neutral-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
