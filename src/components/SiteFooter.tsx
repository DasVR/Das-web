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
    <footer className="border-t border-neutral-900 px-6 py-12 md:px-12 md:py-14 lg:px-24">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-5">
          <div className="h-9 w-32 text-neutral-400">
            <DotMatrix text="ARRIQ" gap={5} letterGap={6} radius={1.35} />
          </div>
          <nav
            className="flex flex-wrap gap-4 font-mono text-xs text-neutral-500"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-orange-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-neutral-600">
            © 2026 Arriq · Das Web Design · Based in Florida, working widely
          </p>
        </div>

        <div className="flex flex-col gap-3 font-mono text-[11px] tracking-wide text-neutral-600 md:items-end">
          <a
            href="mailto:hello@dasdev.net"
            className="text-neutral-400 transition-colors hover:text-orange-400"
          >
            hello@dasdev.net
          </a>
          <a
            href="https://github.com/DasVR"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-orange-400"
          >
            github.com/DasVR
          </a>
          <p>Built with Next.js · Tailwind · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
