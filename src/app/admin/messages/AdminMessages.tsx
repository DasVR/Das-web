"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminGate } from "@/components/portal/AdminGate";

/**
 * The thread index moved to the Inbox's "Recent conversations" panel and
 * replying moved into each client's Messages tab (Part 1a/1b). This route
 * stays only so old bookmarks/links do not 404.
 */
export function AdminMessages() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <AdminGate>
      <p className="text-sm text-neutral-500">
        Messages moved into the Inbox and each client&apos;s page. Redirecting…
      </p>
    </AdminGate>
  );
}
