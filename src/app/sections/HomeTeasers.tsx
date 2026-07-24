"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { featuredProjects } from "@/lib/projects";
import { haptic } from "@/lib/haptic";

const servicePreview = [
  "Web Design",
  "Branding",
  "Development",
  "Landing Pages",
  "SEO",
  "UI / Product",
  "Maintenance",
] as const;

export function HomeTeasers() {
  return (
    <>
      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <SectionHeader
          label="Work"
          index="01"
          title="Selected stories — honest work, no fake metrics."
        />
        <div className="flex flex-col gap-4 md:gap-5">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
        <Link
          href="/work"
          onClick={() => haptic(10)}
          className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 transition-colors hover:text-orange-400"
        >
          View all work
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </section>

      <section className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <SectionHeader
          label="Lab"
          index="01b"
          title="Craft studies in public."
        />
        <AnimatedSection>
          <p className="max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
            Dot matrix wordmarks, grain atmosphere, snappy cursor, scramble type,
            magnetic CTAs, and scroll-drawn process lines — experiments that ship
            into the product.
          </p>
          <Link
            href="/lab"
            onClick={() => haptic(10)}
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 transition-colors hover:text-orange-400"
          >
            Enter the lab
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </AnimatedSection>
      </section>

      <section className="border-t border-neutral-900 px-6 py-16 md:px-12 md:py-20 lg:px-24">
        <p className="font-mono text-xs tracking-widest text-orange-500/80">
          / The gap
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight md:text-5xl">
          Most small-business sites look fine.{" "}
          <span className="text-neutral-500">Few feel intentional.</span>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-500">
          That gap — between template noise and a presence people trust — is the
          work.
        </p>
      </section>

      <section className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <SectionHeader
          label="Services"
          index="04"
          title="Design, build, and ongoing care."
        />
        <ul className="max-w-3xl">
          {servicePreview.map((name) => (
            <li
              key={name}
              className="border-b border-neutral-800 py-4 font-display text-2xl font-semibold tracking-tight text-neutral-300 md:text-4xl"
            >
              {name}
            </li>
          ))}
        </ul>
        <Link
          href="/services"
          onClick={() => haptic(10)}
          className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 transition-colors hover:text-orange-400"
        >
          Full services + pricing
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
