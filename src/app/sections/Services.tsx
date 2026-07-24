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
    price: "Starting at $500",
  },
  {
    name: "Branding",
    detail:
      "Identity systems — logo, type, color — so your site, socials, and materials feel like one brand.",
    price: "Starting at $350",
  },
  {
    name: "Development",
    detail:
      "Custom builds when quality matters. Clean code, performance, and hosting that fits — no bloated page builders.",
    price: "Included with design",
  },
  {
    name: "Landing Pages",
    detail:
      "Focused pages for launches, offers, and campaigns — designed to convert without clutter.",
    price: "Starting at $400",
  },
  {
    name: "SEO",
    detail:
      "Titles, structure, meta, and discoverability basics so the right people can find you — local or broader.",
    price: "Starting at $200",
  },
  {
    name: "UI / Product",
    detail:
      "Interfaces for tools, apps, and product marketing pages — clear UI with the same editorial care.",
    price: "Scoped per project",
  },
  {
    name: "Maintenance",
    detail:
      "Updates, content tweaks, uptime checks, and small fixes so your site stays sharp after launch.",
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
      <SectionHeader
        label="Services"
        index="04"
        title="What I offer — design, build, and ongoing care."
      />

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
