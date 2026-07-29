"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DotMatrix } from "@/components/DotMatrix";
import { PortalNotice } from "@/components/portal/PortalShell";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, supabaseAnonKey } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Mode = "signin" | "reset" | "activate";

const MIN_PASSWORD_LENGTH = 10;

const tabs: { mode: Mode; label: string }[] = [
  { mode: "signin", label: "Sign in" },
  { mode: "activate", label: "Activate with key" },
];

export function LoginContent() {
  const router = useRouter();
  const { session, loading, role } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !session) return;
    router.replace(role === "admin" ? "/admin" : "/dashboard");
  }, [loading, session, role, router]);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function handleSignIn() {
    const { error: signInError } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("That email and access key do not match.");
      return;
    }

    router.replace("/dashboard");
  }

  async function handleReset() {
    const { error: resetError } = await getSupabase().auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: "https://dasdev.net/dashboard/reset" }
    );

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setNotice("If that email has an account, a reset link is on its way.");
  }

  async function handleActivateWithKey() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (!accessKey.trim()) {
      setError("Enter the access key you were given.");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/functions/v1/verify-access-key`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          access_key: accessKey.trim().toUpperCase(),
        }),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not activate. Check your key and try again.");
      return;
    }

    const { error: signInError } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Activated! Sign in with your email and new password.");
      return;
    }

    setNotice("Workspace activated! Redirecting...");
    setTimeout(() => router.replace("/dashboard"), 800);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim().includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (mode !== "reset" && !password) {
      setError("Enter your access key.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") await handleSignIn();
      else if (mode === "activate") await handleActivateWithKey();
      else await handleReset();
    } catch {
      setError("Something went wrong. Try again, or email hello@dasdev.net.");
    } finally {
      setBusy(false);
    }
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(249,115,22,0.10),transparent_55%)]" />

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

        <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-orange-500/80">
          Client portal
        </p>
        <p className="mb-8 text-center text-sm text-neutral-500">
          Projects, updates, and care. In one place.
        </p>

        {!isSupabaseConfigured ? (
          <PortalNotice tone="info">
            The portal is not connected yet. Set NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to enable sign in. In the meantime,
            email{" "}
            <a className="underline" href="mailto:hello@dasdev.net">
              hello@dasdev.net
            </a>
            .
          </PortalNotice>
        ) : (
          <>
            {mode !== "reset" && (
              <div
                role="tablist"
                aria-label="Portal access"
                className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-neutral-800 bg-[#0e0e0e] p-1"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.mode}
                    role="tab"
                    type="button"
                    aria-selected={mode === tab.mode}
                    onClick={() => switchMode(tab.mode)}
                    className={cn(
                      "rounded-md px-3 py-2 text-xs font-medium transition-colors",
                      mode === tab.mode
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                placeholder="you@business.com"
                required
              />

              {mode !== "reset" && (
                <Field
                  label={mode === "activate" ? "Choose a password" : "Access key"}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  placeholder={
                    mode === "activate"
                      ? `At least ${MIN_PASSWORD_LENGTH} characters`
                      : "Your access key"
                  }
                  required
                />
              )}

              {mode === "activate" && (
                <div>
                  <Field
                    label="Access key"
                    value={accessKey}
                    onChange={setAccessKey}
                    autoComplete="off"
                    placeholder="The key your admin gave you"
                    required
                  />
                  <p className="mt-1.5 px-1 text-[11px] text-neutral-600">
                    A short code from DasDev, sent when your project started —
                    not the password you choose above.
                  </p>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={busy}
                className="w-full rounded-md bg-white px-4 py-3.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 active:bg-neutral-300 disabled:opacity-60"
              >
                {busy
                  ? "Working…"
                  : mode === "signin"
                    ? "Enter workspace"
                    : mode === "activate"
                      ? "Activate workspace"
                      : "Send reset link"}
              </motion.button>
            </form>

            {error && (
              <div className="mt-3">
                <PortalNotice tone="error">{error}</PortalNotice>
              </div>
            )}
            {notice && (
              <div className="mt-3">
                <PortalNotice tone="success">{notice}</PortalNotice>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => switchMode(mode === "reset" ? "signin" : "reset")}
                className="text-neutral-500 transition-colors hover:text-neutral-300"
              >
                {mode === "reset" ? "Back to sign in" : "Forgot access key?"}
              </button>
              <Link
                href="/contact"
                className="text-neutral-500 transition-colors hover:text-neutral-300"
              >
                Contact DasDev
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder ?? label}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-neutral-800 bg-[#111] px-4 py-3.5 text-base text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
      />
    </div>
  );
}
