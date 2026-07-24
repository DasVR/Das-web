import Link from "next/link";
import { DotMatrix } from "@/components/DotMatrix";

const footerLinks = [
  { href: "/work", label: "/Work" },
  { href: "/lab", label: "/Lab" },
  { href: "/about", label: "/About" },
  { href: "/services", label: "/Services" },
  { href: "/now", label: "/Now" },
  { href: "/contact", label: "/Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-900 px-6 py-10 md:px-12 md:py-12 lg:px-24">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-28 text-neutral-700">
            <DotMatrix text="ARRIQ" gap={5} letterGap={6} radius={1.1} />
          </div>
          <nav
            className="flex flex-wrap gap-4 font-mono text-xs text-neutral-500"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-neutral-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-neutral-600">© 2026 Arriq · Das Web Design</p>
        </div>
        <p className="font-mono text-[11px] tracking-wide text-neutral-600">
          Built with Next.js · Tailwind · Framer Motion
        </p>
      </div>
    </footer>
  );
}
