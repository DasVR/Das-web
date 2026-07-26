"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DASH_AUTH_KEY, DASH_CLIENT_KEY, demoWorkspace } from "@/lib/dashboard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const emailOk = email.trim().includes("@");
    const keyOk = key.trim().length > 0;

    if (!emailOk || !keyOk) {
      setErr(
        !emailOk && !keyOk
          ? "Email and access key required"
          : !emailOk
            ? "Enter a valid email"
            : "Access key required"
      );
      setTimeout(() => setErr(null), 1600);
      return;
    }

    // Demo gate only — any non-empty key unlocks the sample workspace.
    // Replace with real auth before sharing with clients.
    localStorage.setItem(DASH_AUTH_KEY, "ok");
    localStorage.setItem(DASH_CLIENT_KEY, demoWorkspace.clientId);
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-[#0a0a0a] px-5 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-sm"
      >
        <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
          Client portal
        </p>
        <h1 className="mb-1 text-center font-display text-2xl font-medium tracking-tight text-white">
          DasDev
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-500">
          Projects, updates, and care — in one place.
        </p>

        <form onSubmit={handle} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            autoComplete="email"
            className="w-full rounded-md border border-neutral-800 bg-[#111] px-4 py-3.5 text-base text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
          />
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Access key"
            autoComplete="current-password"
            className="w-full rounded-md border border-neutral-800 bg-[#111] px-4 py-3.5 text-base text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-md bg-white px-4 py-3.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 active:bg-neutral-300"
          >
            Enter workspace
          </motion.button>
        </form>

        {err && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-xs text-red-400"
          >
            {err}
          </motion.p>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-neutral-600">
          Need an invite?{" "}
          <Link
            href="/contact"
            className="text-neutral-400 underline-offset-2 hover:text-neutral-300 hover:underline"
          >
            Contact DasDev
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
