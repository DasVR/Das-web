"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminGate } from "@/components/portal/AdminGate";

/**
 * Leads folded into the Inbox (Part 1a of the redesign) — this route stays
 * only so old bookmarks/links do not 404.
 */
export function AdminLeads() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin#leads");
  }, [router]);

  return (
    <AdminGate>
      <p className="text-sm text-neutral-500">
        Leads moved into the Inbox. Redirecting…
      </p>
    </AdminGate>
  );
}
