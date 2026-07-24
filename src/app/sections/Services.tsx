"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
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
    <section className="border-t border-neutral-900 px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <SectionHeader label="Services" />

      <div className="max-w-3xl">
        {services.map((service, i) => {
          const isOpen = open === service.name;
          return (
            <AnimatedSection key={service.name} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : service.name)}
                className="group flex w-full flex-col border-b border-neutral-800 py-4 text-left transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg md:text-xl">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-neutral-500"> — {service.blurb}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-neutral-500">
                    <span className="hidden text-xs tracking-wide text-orange-500/90 sm:inline">
                      {service.price}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                    <ArrowUpRight
                      className="hidden h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100 md:block"
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
                    <p className="pt-3 text-sm leading-relaxed text-neutral-400 md:pr-16">
                      {service.detail}
                    </p>
                    <p className="pt-2 text-xs text-orange-500 sm:hidden">
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
