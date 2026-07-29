"use client";

import Link from "next/link";
import { PortalNotice, PortalShell } from "@/components/portal/PortalShell";
import { useRequireAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export const adminNavLinks = [
  { href: "/admin", label: "Inbox" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
];

/**
 * Wraps every admin page. The redirect here is convenience only; an admin-only
 * read that slipped through would still return nothing, because the admin
 * branch of each RLS policy checks the caller's role in the database.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const { allowed, loading, session } = useRequireAuth("admin");

  if (!isSupabaseConfigured) {
    return (
      <PortalShell links={adminNavLinks} label="Admin">
        <PortalNotice tone="info">
          The admin dashboard needs a Supabase project. See supabase/README.md,
          then promote your account to admin.
        </PortalNotice>
      </PortalShell>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
        Checking your session…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-neutral-400">
          {session
            ? "This area is for DasDev staff."
            : "Sign in to continue."}
        </p>
        <Link
          href={session ? "/dashboard" : "/dashboard/login"}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
        >
          {session ? "Go to your workspace" : "Sign in"}
        </Link>
      </div>
    );
  }

  return (
    <PortalShell links={adminNavLinks} label="Admin">
      {children}
    </PortalShell>
  );
}
