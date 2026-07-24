"use client";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#method", label: "Method" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="absolute right-6 top-6 z-30 hidden items-center gap-4 md:right-12 md:flex md:gap-5"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="font-mono text-[11px] tracking-widest text-neutral-500 transition-colors hover:text-neutral-200"
        >
          /{link.label}
        </a>
      ))}
    </nav>
  );
}
