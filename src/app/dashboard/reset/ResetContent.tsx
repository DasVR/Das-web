"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DotMatrix } from "@/components/DotMatrix";
import { PortalNotice } from "@/components/portal/PortalShell";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const MIN_PASSWORD_LENGTH = 10;

/**
 * Lands here from the emailed recovery link. Supabase exchanges the link for a
 * short-lived session on load, which is what authorises the update below.
 */
export function ResetContent() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Those do not match.");
      return;
    }

    setBusy(true);
    const { error: updateError } = await getSupabase().auth.updateUser({
      password,
    });
    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.replace("/dashboard"), 1600);
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-[#0a0a0a] px-5 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-sm"
      >
        <Link href="/" className="mx-auto mb-7 block h-10 w-44 text-neutral-200">
          <DotMatrix text="DASDEV" gap={4} letterGap={5} radius={1.3} />
          <span className="sr-only">DasDev</span>
        </Link>

        <p className="mb-8 text-center text-sm text-neutral-500">
          Choose a new access key.
        </p>

        {done ? (
          <PortalNotice tone="success">
            Access key updated. Taking you to your workspace.
          </PortalNotice>
        ) : !ready ? (
          <PortalNotice tone="info">
            Open the reset link from your email to continue.{" "}
            <Link className="underline" href="/dashboard/login">
              Request a new one
            </Link>
            .
          </PortalNotice>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder={`New access key (${MIN_PASSWORD_LENGTH}+ characters)`}
              className="w-full rounded-md border border-neutral-800 bg-[#111] px-4 py-3.5 text-base text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
            />
            <input
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              autoComplete="new-password"
              placeholder="Confirm access key"
              className="w-full rounded-md border border-neutral-800 bg-[#111] px-4 py-3.5 text-base text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-white px-4 py-3.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save access key"}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-3">
            <PortalNotice tone="error">{error}</PortalNotice>
          </div>
        )}
      </motion.div>
    </div>
  );
}
