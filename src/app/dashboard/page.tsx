"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DASH_AUTH_KEY,
  DASH_CLIENT_KEY,
  demoWorkspace,
  projectStatusCounts,
  statusBadgeClass,
  supportedIndustries,
} from "@/lib/dashboard";
import { getServiceName, services } from "@/lib/services";

export default function DashboardHome() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const workspace = demoWorkspace;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(DASH_AUTH_KEY)) {
      router.replace("/dashboard/login");
      return;
    }
    if (!localStorage.getItem(DASH_CLIENT_KEY)) {
      localStorage.setItem(DASH_CLIENT_KEY, workspace.clientId);
    }
    setReady(true);
  }, [router, workspace.clientId]);

  const counts = useMemo(
    () => projectStatusCounts(workspace.projects),
    [workspace.projects]
  );

  const openUpdates = workspace.updates.filter((u) => !u.done);
  const availableServices = services.filter(
    (s) => !workspace.engagedServices.includes(s.id)
  );

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
            Client workspace
          </p>
          <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
            {workspace.businessName}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Hi {workspace.contactName}. {workspace.industry} · client since{" "}
            {workspace.since}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(DASH_AUTH_KEY);
            localStorage.removeItem(DASH_CLIENT_KEY);
            router.push("/dashboard/login");
          }}
          className="self-start text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          Log out
        </button>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:grid-cols-4 sm:gap-4">
        {(
          [
            { label: "Live", count: counts.live },
            { label: "In progress", count: counts["in progress"] },
            { label: "In review", count: counts["in review"] },
            { label: "Open items", count: openUpdates.length },
          ] as const
        ).map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="rounded-lg border border-neutral-800 bg-[#111] p-3 sm:p-4"
          >
            <p className="text-xl font-medium sm:text-2xl">{s.count}</p>
            <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      <section className="mb-8 sm:mb-10">
        <div className="mb-3 flex items-baseline justify-between sm:mb-4">
          <h2 className="text-sm font-medium text-neutral-400">Projects</h2>
          <span className="font-mono text-[10px] text-neutral-600">
            {workspace.projects.length} active
          </span>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {workspace.projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04, duration: 0.35 }}
              className="rounded-lg border border-neutral-800 bg-[#111] px-4 py-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {p.url === "#" ? "URL pending" : p.url}
                    {p.note ? ` · ${p.note}` : ""}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadgeClass(p.status)}`}
                >
                  {p.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.services.map((sid) => (
                  <span
                    key={sid}
                    className="rounded border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-400"
                  >
                    {getServiceName(sid)}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8 sm:mb-10">
        <h2 className="mb-3 text-sm font-medium text-neutral-400 sm:mb-4">
          Updates
        </h2>
        <div className="space-y-2">
          {workspace.updates.map((u) => (
            <div
              key={u.id}
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
              <span className="flex-shrink-0 text-xs text-neutral-600">
                {u.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 sm:mb-10">
        <h2 className="mb-3 text-sm font-medium text-neutral-400 sm:mb-4">
          Care plan
        </h2>
        <div className="rounded-lg border border-neutral-800 bg-[#111] px-4 py-4">
          {workspace.care.active ? (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{workspace.care.plan}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-green-400">
                  Active · renews {workspace.care.renews}
                </p>
              </div>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {workspace.care.included.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-neutral-400 before:mr-2 before:text-neutral-600 before:content-['·']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-neutral-400">
              No care plan yet.{" "}
              <Link
                href="/contact"
                className="text-neutral-300 underline-offset-2 hover:underline"
              >
                Ask about Maintenance
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="mb-8 sm:mb-10">
        <div className="mb-3 flex items-baseline justify-between sm:mb-4">
          <h2 className="text-sm font-medium text-neutral-400">Your services</h2>
          <Link
            href="/services"
            className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          >
            Full menu
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {workspace.engagedServices.map((id) => (
            <span
              key={id}
              className="rounded-md border border-neutral-800 bg-[#111] px-3 py-1.5 text-xs text-neutral-300"
            >
              {getServiceName(id)}
            </span>
          ))}
        </div>
        {availableServices.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs text-neutral-500">
              Add on — built for many kinds of clients
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {availableServices.slice(0, 6).map((s) => (
                <Link
                  key={s.id}
                  href="/contact"
                  className="group rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3 py-3 transition-colors hover:border-neutral-600"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium group-hover:text-white">
                      {s.name}
                    </p>
                    <span className="font-mono text-[10px] text-orange-400/80">
                      {s.price}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                    {s.detail}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-neutral-900 pt-6">
        <p className="text-xs text-neutral-600">
          Built for broad SMB work: {supportedIndustries.slice(0, 4).join(", ")}
          , and more.
        </p>
        <p className="mt-2 text-xs text-neutral-600">
          Questions or a new request?{" "}
          <Link
            href="/contact"
            className="text-neutral-400 underline-offset-2 hover:text-neutral-300 hover:underline"
          >
            Contact DasDev
          </Link>
        </p>
      </section>
    </div>
  );
}
