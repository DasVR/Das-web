"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/utils";
import { serviceCount, services } from "@/lib/services";

export function Services() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="services" className="px-6 py-20 md:px-12 md:py-32 lg:px-24">
      <SectionHeader
        titleAs="h1"
        label="Services"
        index="04"
        title="What I offer. Design, build, grow, and ongoing care."
        meta={
          <>
            <span className="text-neutral-300">
              {serviceCount} offerings
            </span>
            <span>Most projects land $500–$1,500</span>
            <span>Tap a service for detail</span>
          </>
        }
      />

      <div className="max-w-5xl">
        {services.map((service, i) => {
          const isOpen = open === service.id;
          const indexLabel = String(i + 1).padStart(2, "0");
          return (
            <AnimatedSection key={service.id} delay={i * 0.04}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : service.id)}
                className="group flex w-full flex-col border-b border-neutral-800 py-5 text-left transition-colors hover:border-neutral-600 md:py-6"
                aria-expanded={isOpen}
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-neutral-700">
                      {indexLabel}
                    </span>
                    <span
                      className={cn(
                        "font-display text-3xl font-bold tracking-tight transition-transform duration-300 md:text-5xl lg:text-6xl",
                        "group-hover:translate-x-2",
                        isOpen
                          ? "text-white"
                          : "text-neutral-300 group-hover:text-white"
                      )}
                    >
                      {service.name}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-4">
                    <span className="font-mono text-[10px] tracking-wide text-orange-400 sm:text-xs md:text-sm">
                      {service.price}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-5 text-neutral-600 transition-all duration-300",
                        "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        isOpen &&
                          "translate-x-0 rotate-90 opacity-100 text-orange-500"
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pt-3 text-sm leading-relaxed text-neutral-400 md:text-base">
                      {service.detail}
                    </p>
                    <p className="pt-2 font-mono text-[11px] tracking-wide text-neutral-600">
                      Fits: {service.fits.join(" · ")}
                    </p>
                    <p className="pt-2 font-mono text-xs text-orange-400 sm:hidden">
                      {service.price}
                    </p>
                  </div>
                </div>
              </button>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
