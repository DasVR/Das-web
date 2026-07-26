"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const links = [
  { href: "/work", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

const springMask = { type: "spring" as const, stiffness: 320, damping: 30 };

type MaskRect = { left: number; width: number };

export function SiteNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mask, setMask] = useState<MaskRect | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function toggleMenu() {
    triggerHaptic(isOpen ? HapticPatterns.toggle : HapticPatterns.medium);
    setIsOpen((v) => !v);
  }

  function closeMenu() {
    triggerHaptic(HapticPatterns.light);
    setIsOpen(false);
  }

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
            !isOpen &&
            "border-b border-neutral-900/80 bg-[#0a0a0a]/70 backdrop-blur-md"
        )}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => {
              triggerHaptic(HapticPatterns.light);
              if (isOpen) setIsOpen(false);
            }}
            className="relative z-50 font-mono text-xs tracking-[0.2em] text-neutral-300 transition-colors hover:text-white"
          >
            DASDEV
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
                  onClick={() => triggerHaptic(HapticPatterns.light)}
                  className={cn(
                    "relative z-10 px-1.5 py-1 font-mono text-[11px] tracking-widest transition-colors",
                    isActive
                      ? "text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-200"
                  )}
                >
                  <span
                    onMouseEnter={(e) => trackMask(e.currentTarget)}
                    onFocus={(e) => trackMask(e.currentTarget)}
                  >
                    /{link.label}
                  </span>
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
            onClick={toggleMenu}
            className="tap-highlight-none relative z-50 flex touch-manipulation flex-col gap-1.5 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              className="block h-px w-5 origin-center bg-neutral-300"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            <motion.span
              className="block h-px w-5 origin-center bg-neutral-300"
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -3 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a]/98 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav aria-label="Mobile" className="flex flex-col items-center gap-6">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 22,
                      delay: i * 0.06,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "tap-highlight-none block font-display text-4xl font-bold tracking-tight transition-colors",
                        isActive
                          ? "text-orange-500"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobileActive"
                          className="mr-2 inline-block h-2 w-2 rounded-full bg-orange-500"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href="/now"
                  onClick={closeMenu}
                  className="font-mono text-xs tracking-widest text-neutral-600 hover:text-orange-400"
                >
                  / Now. what I&apos;m doing
                </Link>
              </motion.div>
            </nav>

            <button
              onClick={closeMenu}
              className="tap-highlight-none absolute bottom-8 flex touch-manipulation items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-500"
              aria-label="Close menu"
            >
              <X className="size-4" />
              CLOSE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
