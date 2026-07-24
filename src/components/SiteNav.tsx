"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/work", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed left-0 right-0 top-0 z-50 px-6 py-4 md:px-12 md:py-5 lg:px-24"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-xs tracking-[0.2em] text-neutral-300 transition-colors hover:text-white"
        >
          ARRIQ
        </Link>

        {/* Links */}
        <div className="hidden items-center gap-4 md:flex md:gap-5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative font-mono text-[11px] tracking-widest text-neutral-500 transition-colors hover:text-neutral-200"
              >
                /{link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-orange-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Open menu"
          onClick={() => {
            // haptic feedback on supported devices
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
              navigator.vibrate(10);
            }
          }}
        >
          <span className="block h-px w-5 bg-neutral-400" />
          <span className="block h-px w-5 bg-neutral-400" />
        </button>
      </div>
    </nav>
  );
}
