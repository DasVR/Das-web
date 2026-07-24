"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/utils";

const services = [
  {
    name: "Web Design",
    detail:
      "Homepages that build trust fast — clear services, proof, and a path to call or book. Mobile-first and fast.",
    price: "Starting at $500",
  },
  {
    name: "Branding",
    detail:
      "A simple identity system so your site, cards, and Google listing feel like the same business.",
    price: "Starting at $350",
  },
  {
    name: "Development",
    detail:
      "Clean code, static hosting when it fits, no bloated page builders. Built to load under a few seconds.",
    price: "Included with design",
  },
  {
    name: "SEO",
    detail:
      "Local SEO basics: titles, meta, structure, Google Business alignment — so Largo searches find you.",
    price: "Starting at $200",
  },
  {
    name: "Maintenance",
    detail:
      "Updates, content tweaks, uptime checks, and small fixes so your site doesn’t go stale after launch.",
    price: "From $50 / month",
  },
];

/** monolog giant stacked service names + expandable detail */
export function Services() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader label="Services" index="04" title="What we do." />

      <div className="max-w-4xl">
        {services.map((service, i) => {
          const isOpen = open === service.name;
          return (
            <AnimatedSection key={service.name} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : service.name)}
                className="group flex w-full flex-col border-b border-neutral-800 py-5 text-left md:py-6"
                aria-expanded={isOpen}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className={cn(
                      "font-display text-3xl font-bold tracking-tight transition-transform duration-300 md:text-5xl lg:text-6xl",
                      "group-hover:translate-x-2",
                      isOpen ? "text-white" : "text-neutral-300 group-hover:text-white"
                    )}
                  >
                    {service.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="hidden font-mono text-[11px] tracking-wide text-orange-500/90 sm:inline">
                      {service.price}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-5 text-neutral-600 transition-all duration-300",
                        "opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100",
                        isOpen && "translate-x-0 opacity-100 text-orange-500"
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
                    <p className="pt-2 font-mono text-[11px] text-orange-500 sm:hidden">
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
