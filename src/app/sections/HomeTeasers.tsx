"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Marquee } from "@/components/Marquee";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { featuredProjects } from "@/lib/projects";
import { haptic } from "@/lib/haptic";

const servicePreview = [
  { name: "Web Design", price: "From $500" },
  { name: "Branding", price: "From $350" },
  { name: "Development", price: "With design" },
  { name: "Landing Pages", price: "From $400" },
  { name: "SEO", price: "From $200" },
  { name: "UI / Product", price: "Per project" },
  { name: "Maintenance", price: "$50 / month" },
] as const;

const labStudies = [
  { id: "01", name: "Dot matrix wordmark" },
  { id: "02", name: "Grain & vignette" },
  { id: "03", name: "Snappy cursor" },
  { id: "04", name: "Text scramble" },
] as const;

const marqueeItems = [
  "TAKING NEW PROJECTS",
  "WEB DESIGN",
  "BRANDING",
  "LANDING PAGES",
  "SEO",
  "BASED IN FLORIDA",
  "WORKING WIDELY",
] as const;

function TeaserLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      onClick={() => haptic(10)}
      className="group mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 transition-colors hover:text-orange-400"
    >
      {label}
      <ArrowUpRight
        className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

export function HomeTeasers() {
  return (
    <>
      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <SectionHeader
          label="Work"
          index="01"
          title="Selected stories — honest work, no fake metrics."
          meta={
            <>
              <span className="text-neutral-300">Personal + client</span>
              <span>Case studies ship as real work lands</span>
              <span>No invented conversion numbers</span>
            </>
          }
        />
        <div className="flex flex-col gap-4 md:gap-5">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
        <TeaserLink href="/work" label="View all work" />
      </section>

      <Marquee items={marqueeItems} />

      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <SectionHeader
          label="Lab"
          index="02"
          title="Craft studies in public."
          meta={
            <>
              <span className="text-neutral-300">Six studies</span>
              <span>Motion, type, interaction</span>
            </>
          }
        />
        <AnimatedSection>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
            <p className="max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
              Dot matrix wordmarks, grain atmosphere, a snappy cursor, scramble
              type, magnetic CTAs, and scroll-drawn process lines — experiments
              that ship into the product instead of dying in a folder.
            </p>
            <ul className="flex w-full flex-col gap-3 lg:w-72">
              {labStudies.map((study) => (
                <li
                  key={study.id}
                  className="flex items-baseline justify-between gap-4 border-b border-neutral-900 pb-2 font-mono text-[11px] tracking-wide text-neutral-500"
                >
                  <span className="text-orange-500/70">LAB /{study.id}</span>
                  <span className="text-neutral-400">{study.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <TeaserLink href="/lab" label="Enter the lab" />
        </AnimatedSection>
      </section>

      <section className="border-y border-neutral-900 bg-neutral-950/40 px-6 py-16 md:px-12 md:py-20 lg:px-24">
        <p className="font-mono text-xs tracking-widest text-orange-500/80">
          / The gap
        </p>
        <h2 className="mt-4 max-w-4xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          Most small-business sites look fine.{" "}
          <span className="text-neutral-500">Few feel intentional.</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-500">
          That gap — between template noise and a presence people trust — is the
          work.
        </p>
      </section>

      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <SectionHeader
          label="Services"
          index="04"
          title="Design, build, and ongoing care."
          meta={
            <>
              <span className="text-neutral-300">Seven offerings</span>
              <span>Most projects $500–$1,500</span>
            </>
          }
        />
        <ul className="max-w-5xl">
          {servicePreview.map((service, i) => (
            <li key={service.name}>
              <Link
                href="/services"
                onClick={() => haptic(10)}
                className="group flex items-baseline justify-between gap-6 border-b border-neutral-800 py-4 transition-colors hover:border-neutral-600"
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-neutral-700">
                    0{i + 1}
                  </span>
                  <span className="font-display text-2xl font-semibold tracking-tight text-neutral-300 transition-all duration-300 group-hover:translate-x-2 group-hover:text-white md:text-4xl">
                    {service.name}
                  </span>
                </span>
                <span className="font-mono text-xs tracking-wide text-neutral-600 transition-colors group-hover:text-orange-400">
                  {service.price}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <TeaserLink href="/services" label="Full services + method" />
      </section>
    </>
  );
}
