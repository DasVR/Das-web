"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { isIOSSafari, triggerHaptic, HapticPatterns } from "@/lib/haptics";
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

/**
 * iOS Haptic Link
 *
 * iOS 26.5+ requires an actual <input type="checkbox" switch> overlay.
 * When the user physically taps the switch, the native Taptic Engine fires.
 * We then forward navigation via onChange.
 */
function HapticLink({
  href,
  onClick,
  children,
  className,
  active,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  const containerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only iOS needs the overlay hack
    if (!isIOSSafari()) return;

    // Ensure container can hold absolute child
    const computed = getComputedStyle(container);
    if (computed.position === "static") {
      container.style.position = "relative";
    }

    const switchEl = document.createElement("input");
    switchEl.type = "checkbox";
    switchEl.setAttribute("switch", ""); // iOS native switch = haptic on tap
    switchEl.setAttribute("aria-hidden", "true");
    switchEl.tabIndex = -1;

    Object.assign(switchEl.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      margin: "0",
      opacity: "0",
      clipPath: "inset(0 round 999px)",
      touchAction: "manipulation",
      cursor: "pointer",
      zIndex: "9999",
    });

    switchEl.style.setProperty("-webkit-tap-highlight-color", "transparent");
    container.appendChild(switchEl);

    const handleChange = () => {
      switchEl.checked = false; // reset immediately
      triggerHaptic(HapticPatterns.light); // fallback for Android
      onClick?.();
    };

    switchEl.addEventListener("change", handleChange);

    return () => {
      switchEl.removeEventListener("change", handleChange);
      switchEl.remove();
    };
  }, [href, onClick]);

  return (
    <Link
      ref={containerRef}
      href={href}
      onClick={(e) => {
        // Non-iOS: use normal trigger
        if (!isIOSSafari()) triggerHaptic(HapticPatterns.light);
        onClick?.();
      }}
      className={className}
      data-active={active ? "true" : undefined}
    >
      {children}
    </Link>
  );
}

/** iOS Haptic button overlay for toggles */
function HapticButton({
  onClick,
  children,
  className,
  label,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!isIOSSafari()) return;

    const computed = getComputedStyle(container);
    if (computed.position === "static") {
      container.style.position = "relative";
    }

    const switchEl = document.createElement("input");
    switchEl.type = "checkbox";
    switchEl.setAttribute("switch", "");
    switchEl.setAttribute("aria-hidden", "true");
    switchEl.tabIndex = -1;

    Object.assign(switchEl.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      margin: "0",
      opacity: "0",
      clipPath: "inset(0 round 999px)",
      touchAction: "manipulation",
      cursor: "pointer",
      zIndex: "9999",
    });

    switchEl.style.setProperty("-webkit-tap-highlight-color", "transparent");
    container.appendChild(switchEl);

    const handleChange = () => {
      switchEl.checked = false;
      onClick();
    };

    switchEl.addEventListener("change", handleChange);

    return () => {
      switchEl.removeEventListener("change", handleChange);
      switchEl.remove();
    };
  }, [onClick]);

  return (
    <button
      ref={containerRef}
      onClick={() => {
        if (!isIOSSafari()) triggerHaptic(HapticPatterns.medium);
        onClick();
      }}
      className={className}
      aria-label={label}
    >
      {children}
    </button>
  );
}

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

  /** Cursor-following hover indicator across desktop links */
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
          <HapticLink
            href="/"
            onClick={() => {
              if (isOpen) closeMenu();
            }}
            className="relative z-50 font-mono text-xs tracking-[0.2em] text-neutral-300 transition-colors hover:text-white"
          >
            ARRIQ
          </HapticLink>

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
                <HapticLink
                  key={link.href}
                  href={link.href}
                  active={isActive}
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
                </HapticLink>
              );
            })}
          </div>

          <HapticButton
            onClick={toggleMenu}
            className="tap-highlight-none relative z-50 flex touch-manipulation flex-col gap-1.5 md:hidden"
            label={isOpen ? "Close menu" : "Open menu"}
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
          </HapticButton>
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
                    <HapticLink
                      href={link.href}
                      onClick={() => {
                        closeMenu();
                      }}
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
                    </HapticLink>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <HapticLink
                  href="/now"
                  onClick={() => {
                    closeMenu();
                  }}
                  className="font-mono text-xs tracking-widest text-neutral-600 hover:text-orange-400"
                >
                  / Now. what I&apos;m doing
                </HapticLink>
              </motion.div>
            </nav>

            <HapticButton
              onClick={closeMenu}
              className="tap-highlight-none absolute bottom-8 flex touch-manipulation items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-500"
              label="Close menu"
            >
              <X className="size-4" />
              CLOSE
            </HapticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
