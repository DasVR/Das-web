"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Phone, Mail, ArrowUpRight, Crosshair, Plus } from "lucide-react";

function DotMatrixText({ text, className = "" }: { text: string; className?: string }) {
  const [dots, setDots] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const newDots = [];
    const cols = text.length * 6;
    const rows = 8;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (Math.random() > 0.3) {
          newDots.push({ x, y, delay: Math.random() * 2 });
        }
      }
    }
    setDots(newDots);
  }, [text]);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${text.length * 48} 64`} className="w-full h-full">
        {dots.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.x * 8 + 4}
            cy={dot.y * 8 + 4}
            r="1.5"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{
              duration: 3,
              delay: dot.delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="sr-only">{text}</span>
      </div>
    </div>
  );
}

const projects = [
  {
    name: "Designwire",
    tag: "Media Platform",
    stat: "2M+ Followers",
    image: "/projects/designwire.jpg",
  },
  {
    name: "Kurogo",
    tag: "Branding Agency",
    stat: "+23% CVR",
    image: "/projects/kurogo.jpg",
  },
  {
    name: "Local Plumber",
    tag: "Small Business",
    stat: "3x Leads",
    image: "/projects/plumber.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24">
        <div className="absolute top-6 left-6 md:left-12 text-xs tracking-widest text-neutral-500">
          LARGO, FL · EST 2026
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <div className="mb-8 w-48 h-16 text-neutral-400">
            <DotMatrixText text="ARRIQ" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
            Websites that
            <br />
            speak your
            <br />
            brand&apos;s voice.
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-lg leading-relaxed">
            Web design for small businesses in Largo, Florida.
            Built to look legit and convert visitors into customers.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors"
            >
              View Work
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 rounded-full hover:border-neutral-500 transition-colors"
            >
              Start a Project
            </a>
          </div>
        </motion.div>

        <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-2 text-neutral-600">
          <Plus className="w-4 h-4" />
          <span className="text-sm">Scroll to explore</span>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-4 mb-16">
          <Crosshair className="w-5 h-5 text-neutral-600" />
          <h2 className="text-sm tracking-widest text-neutral-500 uppercase">
            Selected Work
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[4/3] bg-neutral-900 rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <p className="text-xs text-neutral-400 mb-1">{project.tag}</p>
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-sm text-neutral-300">{project.stat}</p>
              </div>
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Method */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
        <div className="flex items-center gap-4 mb-16">
          <Crosshair className="w-5 h-5 text-neutral-600" />
          <h2 className="text-sm tracking-widest text-neutral-500 uppercase">
            The Method
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          {[
            {
              num: "01",
              title: "Position",
              desc: "Brand direction & reference system. We figure out what you actually need, not what trends say.",
            },
            {
              num: "02",
              title: "Structure",
              desc: "Wireframes & homepage direction. Layout that guides visitors to take action.",
            },
            {
              num: "03",
              title: "Build",
              desc: "Design & development. Fast, responsive, SEO-ready code that performs.",
            },
            {
              num: "04",
              title: "Launch",
              desc: "Deploy & handoff. You get the files, the knowledge, and ongoing support if needed.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6"
            >
              <span className="text-4xl font-bold text-neutral-700 font-mono">
                {step.num}
              </span>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
        <div className="flex items-center gap-4 mb-16">
          <Crosshair className="w-5 h-5 text-neutral-600" />
          <h2 className="text-sm tracking-widest text-neutral-500 uppercase">
            Services
          </h2>
        </div>

        <div className="max-w-3xl">
          {[
            "Web Design — Custom sites that convert",
            "Branding — Logo, colors, identity",
            "Development — Next.js, responsive, fast",
            "SEO — Get found on Google",
            "Maintenance — Keep it running smooth",
          ].map((service, i) => (
            <motion.div
              key={service}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="py-4 border-b border-neutral-800 flex justify-between items-center group cursor-default"
            >
              <span className="text-lg md:text-xl">{service}</span>
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
        <div className="flex items-center gap-4 mb-16">
          <Crosshair className="w-5 h-5 text-neutral-600" />
          <h2 className="text-sm tracking-widest text-neutral-500 uppercase">
            Contact
          </h2>
        </div>

        <div className="max-w-2xl">
          <h3 className="text-4xl md:text-5xl font-bold mb-8">
            Ready when you are.
          </h3>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:hello@dasdev.net"
              className="flex items-center gap-3 text-lg hover:text-neutral-300 transition-colors"
            >
              <Mail className="w-5 h-5" />
              hello@dasdev.net
            </a>
            <a
              href="tel:727-507-1194"
              className="flex items-center gap-3 text-lg hover:text-neutral-300 transition-colors"
            >
              <Phone className="w-5 h-5" />
              (727) 507-1194
            </a>
          </div>

          <p className="mt-12 text-sm text-neutral-600">
            Based in Largo, Florida. Working with local businesses and beyond.
          </p>
        </div>

        <div className="mt-24 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-600">
          <span>© 2026 Arriq</span>
          <div className="flex gap-4">
            <span>Built with Next.js</span>
            <span>·</span>
            <span>Tailwind</span>
          </div>
        </div>
      </section>
    </main>
  );
}
