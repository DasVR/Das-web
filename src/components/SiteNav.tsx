"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";

const links = [
  { href: "/work", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    triggerHaptic(isOpen ? HapticPatterns.toggle : HapticPatterns.medium);
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    triggerHaptic(HapticPatterns.light);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop + Mobile Nav Bar */}
      <nav
        aria-label="Primary"
        className="fixed left-0 right-0 top-0 z-50 px-6 py-4 md:px-12 md:py-5 lg:px-24"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 font-mono text-xs tracking-[0.2em] text-neutral-300 transition-colors hover:text-white"
            onClick={() => {
              if (isOpen) closeMenu();
              triggerHaptic(HapticPatterns.light);
            }}
          >
            ARRIQ
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-4 md:flex md:gap-5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => triggerHaptic(HapticPatterns.light)}
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="relative z-50 flex flex-col gap-1.5 md:hidden tap-highlight-none touch-manipulation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <motion.span
              className="block h-px w-5 bg-neutral-300 origin-center"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 3 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            <motion.span
              className="block h-px w-5 bg-neutral-300 origin-center"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -3 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a]/98 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
                      onClick={() => {
                        triggerHaptic(HapticPatterns.medium);
                        closeMenu();
                      }}
                      className={`block font-display text-4xl font-bold tracking-tight transition-colors tap-highlight-none ${
                        isActive
                          ? "text-orange-500"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobileActive"
                          className="mr-2 inline-block h-2 w-2 rounded-full bg-orange-500"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Close button at bottom */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              onClick={closeMenu}
              className="absolute bottom-8 flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-500 tap-highlight-none touch-manipulation"
            >
              <X className="size-4" />
              CLOSE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
