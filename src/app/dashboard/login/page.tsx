"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim().length > 0) {
      localStorage.setItem("dash_auth", "ok");
      router.push("/dashboard");
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 1200);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-[#0a0a0a] px-5 py-12">
      {/* subtle dot matrix bg */}
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
        <h1 className="mb-1 text-center font-display text-2xl font-medium tracking-tight text-white">
          Arriq
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-500">
          Client dashboard
        </p>

        <form onSubmit={handle} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter access key"
            className="w-full rounded-md border border-neutral-800 bg-[#111] px-4 py-3.5 text-base text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-md bg-white px-4 py-3.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 active:bg-neutral-300"
          >
            Enter
          </motion.button>
        </form>

        {err && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-xs text-red-400"
          >
            Access key required
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
