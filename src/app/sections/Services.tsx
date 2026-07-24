"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/utils";

const services = [
  {
    name: "Web Design",
    blurb: "Custom sites that convert",
    detail:
      "Homepages that build trust fast — clear services, proof, and a path to call or book. Mobile-first and fast.",
    price: "Starting at $500",
  },
  {
    name: "Branding",
    blurb: "Logo, colors, identity",
    detail:
      "A simple identity system so your site, cards, and Google listing feel like the same business.",
    price: "Starting at $350",
  },
  {
    name: "Development",
    blurb: "Next.js, responsive, fast",
    detail:
      "Clean code, static hosting when it fits, no bloated page builders. Built to load under a few seconds.",
    price: "Included with design",
  },
  {
    name: "SEO",
    blurb: "Get found on Google",
    detail:
      "Local SEO basics: titles, meta, structure, Google Business alignment — so Largo searches find you.",
    price: "Starting at $200",
  },
  {
    name: "Maintenance",
    blurb: "Keep it running smooth",
    detail:
      "Updates, content tweaks, uptime checks, and small fixes so your site doesn’t go stale after launch.",
    price: "From $50 / month",
  },
];

export function Services() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader label="Services" index="04" />

      <div className="max-w-3xl">
        {services.map((service, i) => {
          const isOpen = open === service.name;
          return (
            <AnimatedSection key={service.name} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : service.name)}
                className="group flex w-full flex-col border-b border-neutral-800 py-4 text-left transition-colors hover:border-neutral-600"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="min-w-0 text-base md:text-xl">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-neutral-500"> — {service.blurb}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-neutral-500">
                    <span className="hidden font-mono text-[11px] tracking-wide text-orange-500/90 sm:inline">
                      {service.price}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 transition-transform duration-300",
                        isOpen && "rotate-180 text-orange-500"
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
                    <p className="pt-3 text-sm leading-relaxed text-neutral-400 md:pr-12">
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
