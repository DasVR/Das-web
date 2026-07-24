"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { DotMatrix } from "@/components/DotMatrix";
import { SectionHeader } from "@/components/SectionHeader";

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
      className="border-t border-neutral-900 px-6 py-24 md:px-12 md:py-32 lg:px-24"
    >
      <SectionHeader label="Contact" />

      <div className="grid max-w-5xl gap-16 lg:grid-cols-2">
        <AnimatedSection>
          <h3 className="mb-8 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Ready when you are.
          </h3>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:hello@dasdev.net"
              className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              hello@dasdev.net
            </a>
            <a
              href="tel:727-507-1194"
              className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              (727) 507-1194
            </a>
          </div>

          <p className="mt-12 text-sm text-neutral-600">
            Based in Largo, Florida. Working with local businesses and beyond.
            Typical projects: $500–$1,500.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs tracking-widest text-neutral-500">
                NAME
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-600"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs tracking-widest text-neutral-500">
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-600"
                placeholder="you@business.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs tracking-widest text-neutral-500">
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-600"
                placeholder="Tell me about your business and what you need."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Send message
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="text-xs text-neutral-600">
              Opens your email client with a draft to hello@dasdev.net.
            </p>
          </form>
        </AnimatedSection>
      </div>

      <footer className="mt-24 flex flex-col gap-8 border-t border-neutral-900 pt-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <div className="h-8 w-28 text-neutral-700">
            <DotMatrix text="ARRIQ" gap={5} letterGap={6} radius={1.1} />
          </div>
          <nav className="flex flex-wrap gap-4 text-xs text-neutral-500">
            <a href="#work" className="hover:text-neutral-300">
              Work
            </a>
            <a href="#contact" className="hover:text-neutral-300">
              Contact
            </a>
            <a
              href="mailto:hello@dasdev.net"
              className="hover:text-neutral-300"
            >
              Email
            </a>
          </nav>
          <p className="text-xs text-neutral-600">© 2026 Arriq · Das Web Design</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
          <span>Built with Next.js</span>
          <span aria-hidden="true">·</span>
          <span>Tailwind</span>
          <span aria-hidden="true">·</span>
          <span>dasdev.net</span>
        </div>
      </footer>
    </section>
  );
}
