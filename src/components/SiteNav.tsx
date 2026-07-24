"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { haptic } from "@/lib/haptic";
import { cn } from "@/lib/utils";

const links = [
  { href: "/work", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

const springMenu = {
  type: "spring" as const,
  stiffness: 150,
  damping: 18,
  mass: 1.1,
};
const springMask = { type: "spring" as const, stiffness: 320, damping: 30 };

type MaskRect = { left: number; width: number };

export function SiteNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mask, setMask] = useState<MaskRect | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function trackMask(el: HTMLElement | null) {
    if (!el || !listRef.current) return;
    const parent = listRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setMask({ left: rect.left - parent.left, width: rect.width });
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className={cn(
          "fixed left-0 right-0 top-0 z-50 px-6 py-4 transition-colors duration-500 md:px-12 md:py-5 lg:px-24",
          scrolled &&
            "border-b border-neutral-900/80 bg-[#0a0a0a]/70 backdrop-blur-md"
        )}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => haptic(10)}
            className="font-mono text-xs tracking-[0.2em] text-neutral-300 transition-colors hover:text-white"
          >
            ARRIQ
          </Link>

          <div
            ref={listRef}
            className="relative hidden items-center gap-4 md:flex md:gap-5"
            onMouseLeave={() => setMask(null)}
          >
            <AnimatePresence>
              {mask && !reduceMotion ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute -inset-y-1 rounded-md bg-neutral-800/60"
                  initial={{ opacity: 0, left: mask.left, width: mask.width }}
                  animate={{ opacity: 1, left: mask.left, width: mask.width }}
                  exit={{ opacity: 0 }}
                  transition={springMask}
                />
              ) : null}
            </AnimatePresence>

            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => haptic(10)}
                  onMouseEnter={(e) => trackMask(e.currentTarget)}
                  onFocus={(e) => trackMask(e.currentTarget)}
                  className={cn(
                    "relative z-10 px-1.5 py-1 font-mono text-[11px] tracking-widest transition-colors",
                    isActive
                      ? "text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-200"
                  )}
                >
                  /{link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-0.5 left-1.5 right-1.5 h-px bg-orange-500"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            className="relative z-[60] flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => {
              haptic(10);
              setOpen((v) => !v);
            }}
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-px w-5 bg-neutral-300 transition-transform duration-300",
                  open && "translate-y-[3.5px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 bg-neutral-300 transition-transform duration-300",
                  open && "-translate-y-[3.5px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-[#0a0a0a] px-6 pb-10 pt-24 md:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={springMenu}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <button
              type="button"
              className="absolute inset-0 -z-10"
              aria-label="Close menu"
              onClick={() => {
                haptic(10);
                setOpen(false);
              }}
            />
            <ul className="relative z-10 flex flex-1 flex-col justify-center gap-2">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      ...springMenu,
                      delay: reduceMotion ? 0 : 0.04 * i,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => haptic(10)}
                      className={cn(
                        "flex items-baseline gap-3 font-display text-5xl font-bold tracking-tight transition-colors",
                        isActive
                          ? "text-white"
                          : "text-neutral-500 hover:text-white"
                      )}
                    >
                      <span className="font-mono text-[11px] text-orange-500/80">
                        0{i + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <Link
              href="/now"
              onClick={() => haptic(10)}
              className="relative z-10 font-mono text-xs tracking-widest text-neutral-600 hover:text-orange-400"
            >
              / Now — what I&apos;m doing
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
