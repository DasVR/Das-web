"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DotMatrix } from "@/components/DotMatrix";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/**
 * Chrome for authenticated surfaces. Deliberately plainer than the marketing
 * site: no custom cursor, grain, or page transitions, because this is a tool
 * people check quickly rather than a portfolio piece.
 */
export function PortalShell({
  children,
  links,
  label,
}: {
  children: React.ReactNode;
  links: NavLink[];
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, session, signOut } = useAuth();

  const displayName =
    profile?.full_name?.trim() || session?.user.email || "Signed in";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-40 border-b border-neutral-900 bg-[#0a0a0a]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="block h-4 w-24 text-neutral-300">
                <DotMatrix text="DASDEV" gap={3} letterGap={4} radius={0.9} />
              </span>
              <span className="sr-only">DasDev home</span>
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
              {label}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <nav
              className="-mx-1 flex gap-1 overflow-x-auto scrollbar-hide"
              aria-label={label}
            >
              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    link.href !== "/admin" &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs transition-colors",
                      active
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-500 hover:text-neutral-200"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 border-l border-neutral-900 pl-3">
              <span className="hidden max-w-[13rem] truncate text-xs text-neutral-500 sm:block">
                {displayName}
              </span>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/dashboard/login");
                }}
                className="whitespace-nowrap text-xs text-neutral-500 transition-colors hover:text-neutral-200"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export function PortalCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-800 bg-[#111] p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4 sm:mb-4">
      <h2 className="text-sm font-medium text-neutral-400">{children}</h2>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <PortalCard className="text-center">
      <p className="text-sm font-medium text-neutral-300">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-neutral-500">
        {body}
      </p>
    </PortalCard>
  );
}

export function PortalNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-neutral-800 bg-neutral-900/60 text-neutral-300",
    error: "border-red-900/60 bg-red-950/40 text-red-300",
    success: "border-green-900/60 bg-green-950/30 text-green-300",
  } as const;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-3 py-2 text-xs", tones[tone])}
    >
      {children}
    </div>
  );
}
