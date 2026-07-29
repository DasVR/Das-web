"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DotMatrix } from "@/components/DotMatrix";
import { Turnstile, isTurnstileEnabled } from "@/components/Turnstile";
import { PortalNotice } from "@/components/portal/PortalShell";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Mode = "signin" | "request" | "reset" | "invite";

const MIN_PASSWORD_LENGTH = 10;

const tabs: { mode: Mode; label: string }[] = [
  { mode: "signin", label: "Sign in" },
  { mode: "request", label: "Request access" },
];

export function LoginContent() {
  const router = useRouter();
  const { session, loading, role } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in: send them where they belong rather than showing a form.
  useEffect(() => {
    if (loading || !session) return;
    router.replace(role === "admin" ? "/admin" : "/dashboard");
  }, [loading, session, role, router]);

  // Detect invite token from URL (supabase sends ?token=xyz&type=invite)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = new URLSearchParams(window.location.search);
    const token = search.get("token") || search.get("code");
    const type = search.get("type");
    if (token && type === "invite") {
      setMode("invite");
      setNotice("Welcome! Create your access key to get started.");
    }
  }, []);

  async function handleSetPasswordFromInvite() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    const search = new URLSearchParams(window.location.search);
    const token = search.get("token") || search.get("code");
    if (!token) {
      setError("Invite link expired. Request access instead.");
      return;
    }

    const supabase = getSupabase();

    // Step 1: verify the invite token (this signs them in)
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "invite",
    });

    if (verifyError) {
      setError(
        verifyError.message || "Invite link expired. Request access instead."
      );
      return;
    }

    // Step 2: set their password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotice("Access key set! Redirecting...");
    setTimeout(() => router.replace("/dashboard"), 800);
  }

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
      // Supabase returns the same message for unknown email and wrong
      // password; keep it that way so this form cannot enumerate accounts.
      setError("That email and access key do not match.");
      return;
    }

    router.replace("/dashboard");
  }

  async function handleRequestAccess() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (!businessName.trim()) {
      setError("Tell me your business name.");
      return;
    }
    if (isTurnstileEnabled && !captchaToken) {
      setError("Complete the verification check.");
      return;
    }

    const supabase = getSupabase();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: "https://dasdev.net/dashboard/login",
        ...(captchaToken ? { captchaToken } : {}),
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // A new account is 'pending' until an admin attaches it to a client, so
    // this request is the only thing it can write.
    if (data.session && data.user) {
      const { error: requestError } = await supabase
        .from("access_requests")
        .insert({
          user_id: data.user.id,
          business_name: businessName.trim(),
          message: null,
        });
      if (requestError && requestError.code !== "23505") {
        setError(requestError.message);
        return;
      }
    }

    setNotice(
      "Request received. Confirm your email, then I will set up your workspace and email you when it is ready."
    );
    setPassword("");
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

    // Confirm unconditionally: revealing whether an address exists would leak
    // the client list.
    setNotice("If that email has an account, a reset link is on its way.");
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
      else if (mode === "request") await handleRequestAccess();
      else if (mode === "invite") await handleSetPasswordFromInvite();
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
            {mode !== "reset" && mode !== "invite" && (
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
              {mode === "request" && (
                <>
                  <Field
                    label="Your name"
                    value={fullName}
                    onChange={setFullName}
                    autoComplete="name"
                    placeholder="Jordan Reyes"
                  />
                  <Field
                    label="Business name"
                    value={businessName}
                    onChange={setBusinessName}
                    autoComplete="organization"
                    placeholder="Northline Studio"
                    required
                  />
                </>
              )}

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
                  label={mode === "invite" ? "Create access key" : "Access key"}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  placeholder={
                    mode === "request"
                      ? `At least ${MIN_PASSWORD_LENGTH} characters`
                      : mode === "invite"
                        ? "Choose a strong access key"
                        : "Your access key"
                  }
                  required
                />
              )}

              {mode === "request" && (
                <Turnstile onVerify={setCaptchaToken} className="pt-1" />
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
                    : mode === "request"
                      ? "Request access"
                      : mode === "invite"
                        ? "Set access key"
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
