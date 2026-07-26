"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const projects = [
  { name: "Largo Plumbing Co.", status: "live", url: "https://largoplumbing.com" },
  { name: "Sunset HVAC", status: "in review", url: "#" },
  { name: "Tampa Auto Detail", status: "in progress", url: "#" },
];

const updates = [
  { text: "Swap hero image on Largo Plumbing", done: false, date: "Jul 25" },
  { text: "Add testimonials section to Sunset HVAC", done: true, date: "Jul 22" },
];

export default function DashboardHome() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("dash_auth")) {
      router.push("/dashboard/login");
    }
  }, [router]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      {/* header */}
      <div className="mb-8 flex items-center justify-between sm:mb-10">
        <h1 className="font-display text-lg font-medium tracking-tight sm:text-xl">
          Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("dash_auth");
            router.push("/dashboard/login");
          }}
          className="text-xs text-neutral-500 hover:text-neutral-300"
        >
          Log out
        </button>
      </div>

      {/* stats row */}
      <div className="mb-8 grid grid-cols-3 gap-3 sm:mb-10 sm:gap-4">
        {[
          { label: "Live", count: 1 },
          { label: "In Progress", count: 1 },
          { label: "In Review", count: 1 },
        ].map((s) => (
          <motion.div
            key={s.label}
            className="rounded-lg border border-neutral-800 bg-[#111] p-3 sm:p-4"
          >
            <p className="text-xl font-medium sm:text-2xl">{s.count}</p>
            <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* projects */}
      <section className="mb-8 sm:mb-10">
        <h2 className="mb-3 text-sm font-medium text-neutral-400 sm:mb-4">Projects</h2>
        <div className="space-y-2 sm:space-y-3">
          {projects.map((p) => (
            <div
              key={p.name}
              className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-[#111] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="truncate text-xs text-neutral-500">{p.url}</p>
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  p.status === "live"
                    ? "bg-green-500/10 text-green-400"
                    : p.status === "in review"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-neutral-500/10 text-neutral-400"
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* updates */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-400 sm:mb-4">Updates</h2>
        <div className="space-y-2">
          {updates.map((u) => (
            <div
              key={u.text}
              className="flex items-start gap-3 rounded-lg border border-neutral-800 bg-[#111] px-4 py-3 sm:items-center"
            >
              <div
                className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border sm:mt-0 ${
                  u.done
                    ? "border-green-500 bg-green-500"
                    : "border-neutral-600"
                }`}
              />
              <p
                className={`flex-1 text-sm leading-snug ${
                  u.done ? "text-neutral-500 line-through" : "text-white"
                }`}
              >
                {u.text}
              </p>
              <span className="flex-shrink-0 text-xs text-neutral-600">{u.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
