"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminGate } from "@/components/portal/AdminGate";
import {
  EmptyState,
  PortalCard,
  PortalNotice,
} from "@/components/portal/PortalShell";
import { OnboardClientDialog } from "@/components/admin/OnboardClientDialog";
import { deleteClient, fetchAllClients } from "@/lib/admin";
import type { ClientRow } from "@/lib/database.types";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AdminClients() {
  return (
    <AdminGate>
      <ClientsBody />
    </AdminGate>
  );
}

function ClientsBody() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showOnboard, setShowOnboard] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "archived">("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setClients(await fetchAllClients());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load clients.");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = clients;
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.business_name.toLowerCase().includes(q) ||
          (c.contact_name ?? "").toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [clients, filter, search]);

  const activeCount = clients.filter((c) => c.status === "active").length;
  const pausedCount = clients.filter((c) => c.status === "paused").length;
  const archivedCount = clients.filter((c) => c.status === "archived").length;

  async function handleRemove(id: string, name: string) {
    try {
      await deleteClient(id);
      setNotice(`${name} removed.`);
      setConfirmDelete(null);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not remove client.");
    }
  }

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
            {clients.length} total · {activeCount} active · {pausedCount} paused · {archivedCount} archived
          </p>
          <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
            Clients
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowOnboard(true)}
          className="rounded-md bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          + New client
        </button>
      </header>

      {error && (
        <div className="mb-4">
          <PortalNotice tone="error">{error}</PortalNotice>
        </div>
      )}
      {notice && (
        <div className="mb-4">
          <PortalNotice tone="success">{notice}</PortalNotice>
        </div>
      )}

      <OnboardClientDialog
        open={showOnboard}
        onClose={() => setShowOnboard(false)}
        onDone={async () => {
          setNotice("Client added.");
          await load();
        }}
      />

      {/* Search + filter */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="flex-1 rounded-md border border-neutral-800 bg-[#111] px-3 py-2 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
        />
        <div className="flex gap-1">
          {(["all", "active", "paused", "archived"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          body="Add your first client, then hand them their access key."
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matches" body="Try a different search or filter." />
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <Link key={client.id} href={`/admin/clients/detail?id=${client.id}`}>
              <PortalCard className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {client.business_name}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {[client.contact_name, client.email, client.phone]
                      .filter(Boolean)
                      .join(" · ") || "No contact details"}
                    {client.industry ? ` · ${client.industry}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      client.status === "active"
                        ? "bg-green-500/10 text-green-400"
                        : client.status === "paused"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {client.status}
                  </span>
                  {confirmDelete === client.id ? (
                    <div
                      className="flex items-center gap-1"
                      onClick={(event) => event.preventDefault()}
                    >
                      <span className="text-[10px] text-neutral-500">Remove?</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(client.id, client.business_name)}
                        className="rounded bg-red-500/20 px-2 py-1 text-[10px] text-red-300 hover:bg-red-500/30"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="text-[10px] text-neutral-500 hover:text-neutral-300"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        setConfirmDelete(client.id);
                      }}
                      className="text-[10px] text-neutral-600 transition-colors hover:text-red-400"
                      title="Remove client"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </PortalCard>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export function AdminField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="text-xs text-neutral-500">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
      />
    </label>
  );
}
