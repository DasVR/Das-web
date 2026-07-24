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
      "Sites that build trust fast — clear story, proof, and a path to inquire. Mobile-first and fast for small businesses of any industry.",
    price: "From $500",
  },
  {
    name: "Branding",
    detail:
      "Identity systems — logo, type, color — so your site, socials, and materials feel like one brand.",
    price: "From $350",
  },
  {
    name: "Development",
    detail:
      "Custom builds when quality matters. Clean code, performance, and hosting that fits — no bloated page builders.",
    price: "With design",
  },
  {
    name: "Landing Pages",
    detail:
      "Focused pages for launches, offers, and campaigns — designed to convert without clutter.",
    price: "From $400",
  },
  {
    name: "SEO",
    detail:
      "Titles, structure, meta, and discoverability basics so the right people can find you — local or broader.",
    price: "From $200",
  },
  {
    name: "UI / Product",
    detail:
      "Interfaces for tools, apps, and product marketing pages — clear UI with the same editorial care.",
    price: "Per project",
  },
  {
    name: "Maintenance",
    detail:
      "Updates, content tweaks, uptime checks, and small fixes so your site stays sharp after launch.",
    price: "$50 / month",
  },
];

export function Services() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="services" className="px-6 py-20 md:px-12 md:py-32 lg:px-24">
      <SectionHeader
        label="Services"
        index="04"
        title="What I offer — design, build, and ongoing care."
        meta={
          <>
            <span className="text-neutral-300">Seven offerings</span>
            <span>Most projects land $500–$1,500</span>
            <span>Tap a service for detail</span>
          </>
        }
      />

      <div className="max-w-5xl">
        {services.map((service, i) => {
          const isOpen = open === service.name;
          return (
            <AnimatedSection key={service.name} delay={i * 0.04}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : service.name)}
                className="group flex w-full flex-col border-b border-neutral-800 py-5 text-left transition-colors hover:border-neutral-600 md:py-6"
                aria-expanded={isOpen}
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-neutral-700">
                      0{i + 1}
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
                    <span className="hidden font-mono text-xs tracking-wide text-orange-400 sm:inline md:text-sm">
                      {service.price}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-5 text-neutral-600 transition-all duration-300",
                        "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        isOpen && "translate-x-0 rotate-90 opacity-100 text-orange-500"
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
