"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const nextSteps = [
  {
    n: "01",
    t: "You reach out",
    d: "Tell me about your business and what you need — form or email is fine.",
  },
  {
    n: "02",
    t: "I reply within 24h",
    d: "We'll clarify scope, timeline, and a clear investment range.",
  },
  {
    n: "03",
    t: "We start building",
    d: "Discover → design → build → launch. You get something that feels intentional.",
  },
] as const;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    triggerHaptic(HapticPatterns.medium);

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(
        `Project inquiry from ${name || "website"}`
      );
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:hello@dasdev.net?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen">
      <section className="px-6 pb-20 pt-32 md:px-12 md:pb-32 md:pt-40 lg:px-24">
        <SectionHeader
          label="Contact"
          index="05"
          title="Tell me your story."
          meta={
            <>
              <span className="text-neutral-300">Taking new projects</span>
              <span>Usually reply within 24h</span>
              <span>hello@dasdev.net</span>
            </>
          }
        />

        <div className="mt-4 grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-orange-400">
                <span
                  className="size-1.5 rounded-full bg-orange-400"
                  aria-hidden="true"
                />
                TAKING NEW PROJECTS
              </span>
              <span className="font-mono text-[10px] tracking-widest text-neutral-600">
                USUALLY REPLY WITHIN 24H
              </span>
            </div>

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
              <a
                href="https://github.com/DasVR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-lg transition-colors hover:text-orange-400"
              >
                <ArrowUpRight className="size-5" aria-hidden="true" />
                github.com/DasVR
              </a>
            </div>

            <div className="mt-12 border-t border-neutral-900 pt-8">
              <p className="mb-4 font-mono text-[10px] tracking-widest text-neutral-600">
                WHAT HAPPENS NEXT
              </p>
              <ol className="flex flex-col gap-5">
                {nextSteps.map((step) => (
                  <li key={step.n} className="grid grid-cols-[3rem_1fr] gap-3">
                    <span className="font-mono text-sm text-orange-500">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-display text-lg text-neutral-200">
                        {step.t}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                        {step.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-10 text-sm leading-relaxed text-neutral-600">
              Based in Florida · working with clients wherever you are. Typical
              projects: $500–$1,500+.
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
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
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
                  autoComplete="email"
                  placeholder="you@business.com"
                  className="w-full rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
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
                  placeholder="Tell me about your business and what you need."
                  className="w-full resize-y rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-700 focus:border-neutral-500"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 self-start rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </button>
              {status === "sent" ? (
                <p className="text-xs text-green-400">
                  Sent — I&apos;ll reply within 24h.
                </p>
              ) : null}
              {status === "error" ? (
                <p className="text-xs text-orange-400">
                  Couldn&apos;t send. Email hello@dasdev.net directly.
                </p>
              ) : null}
              <p className="text-xs text-neutral-600">
                {FORMSPREE_ID
                  ? "Sends via Formspree to hello@dasdev.net."
                  : "Opens your email client with a draft to hello@dasdev.net."}
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
