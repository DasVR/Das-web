"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { DotMatrix } from "@/components/DotMatrix";
import { SectionHeader } from "@/components/SectionHeader";

const footerLinks = [
  { href: "#work", label: "/Work" },
  { href: "#about", label: "/About" },
  { href: "#method", label: "/Method" },
  { href: "#services", label: "/Services" },
  { href: "#contact", label: "/Contact" },
  { href: "mailto:hello@dasdev.net", label: "Email" },
] as const;

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:hello@dasdev.net?subject=${subject}&body=${body}`;
  }

  return (
    <section
      id="contact"
      className="border-t border-neutral-900 px-6 py-20 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader label="Contact" index="05" title="Tell me your story." />

      <div className="grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
        <AnimatedSection>
          <p className="mb-3 font-mono text-xs tracking-widest text-orange-500/80">
            $ open inbox — hello@dasdev.net
          </p>
          <h3 className="mb-6 font-display text-3xl font-bold tracking-tight md:mb-8 md:text-5xl">
            Ready when you are.
          </h3>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:hello@dasdev.net"
              className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
            >
              <Mail className="size-5" aria-hidden="true" />
              hello@dasdev.net
            </a>
            <a
              href="tel:727-507-1194"
              className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
            >
              <Phone className="size-5" aria-hidden="true" />
              (727) 507-1194
            </a>
          </div>

          <p className="mt-10 text-sm leading-relaxed text-neutral-600 md:mt-12">
            Based in Florida. Working with small businesses and independents
            wherever you are. Typical projects: $500–$1,500+.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 border border-neutral-800/80 bg-neutral-950/40 p-5 md:p-6"
          >
            <p className="font-mono text-[10px] tracking-widest text-neutral-600">
              NEW_MESSAGE
            </p>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="block font-mono text-xs tracking-widest text-neutral-500"
              >
                NAME
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="block font-mono text-xs tracking-widest text-neutral-500"
              >
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
                placeholder="you@business.com"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="block font-mono text-xs tracking-widest text-neutral-500"
              >
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full resize-y rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
                placeholder="Tell me about your business and what you need."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 self-start rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Send message
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>
            <p className="text-xs text-neutral-600">
              Opens your email client with a draft to hello@dasdev.net.
            </p>
          </form>
        </AnimatedSection>
      </div>

      <footer className="mt-20 flex flex-col gap-8 border-t border-neutral-900 pt-8 md:mt-24 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-28 text-neutral-700">
            <DotMatrix text="ARRIQ" gap={5} letterGap={6} radius={1.1} />
          </div>
          <nav
            className="flex flex-wrap gap-4 font-mono text-xs text-neutral-500"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-neutral-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-xs text-neutral-600">© 2026 Arriq · Das Web Design</p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs text-neutral-600">
          <span>Next.js</span>
          <span aria-hidden="true">·</span>
          <span>Tailwind</span>
          <span aria-hidden="true">·</span>
          <span>dasdev.net</span>
        </div>
      </footer>
    </section>
  );
}
