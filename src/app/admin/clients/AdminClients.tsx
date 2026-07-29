"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminGate } from "@/components/portal/AdminGate";
import {
  EmptyState,
  PortalCard,
  PortalNotice,
  SectionTitle,
} from "@/components/portal/PortalShell";
import {
  assignProfileToClient,
  createClient,
  deleteClient,
  fetchAllClients,
  fetchUnassignedProfiles,
  generateAccessKey,
} from "@/lib/admin";
import { supportedIndustries } from "@/lib/dashboard";
import type { ClientRow, ProfileRow } from "@/lib/database.types";
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
  const [pending, setPending] = useState<ProfileRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "archived">("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [nextClients, nextPending] = await Promise.all([
        fetchAllClients(),
        fetchUnassignedProfiles(),
      ]);
      setClients(nextClients);
      setPending(nextPending);
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
          onClick={() => setShowForm((open) => !open)}
          className="rounded-md bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          {showForm ? "Cancel" : "New client"}
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

      {showForm && (
        <div className="mb-8">
          <NewClientForm
            onCreated={async (name) => {
              setShowForm(false);
              setNotice(`${name} added.`);
              await load();
            }}
            onError={setError}
          />
        </div>
      )}

      {/* Search + filter */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
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

      {pending.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Accounts waiting for a workspace</SectionTitle>
          <p className="mb-3 text-xs text-neutral-500">
            These people signed up but cannot see anything until you link them to a client.
          </p>
          <div className="space-y-2">
            {pending.map((profile) => (
              <PortalCard
                key={profile.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    {profile.full_name ?? "Unnamed account"}
                  </p>
                  <p className="truncate font-mono text-[10px] text-neutral-600">
                    {profile.id}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="sr-only">Assign to client</span>
                  <select
                    defaultValue=""
                    onChange={async (event) => {
                      const clientId = event.target.value;
                      if (!clientId) return;
                      try {
                        await assignProfileToClient(profile.id, clientId);
                        setNotice("Account linked.");
                        await load();
                      } catch (cause) {
                        setError(
                          cause instanceof Error
                            ? cause.message
                            : "Could not link account."
                        );
                      }
                    }}
                    className="rounded-md border border-neutral-800 bg-[#111] px-2 py-1.5 text-xs text-white outline-none focus:border-neutral-600"
                  >
                    <option value="">Link to client…</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.business_name}
                      </option>
                    ))}
                  </select>
                </label>
              </PortalCard>
            ))}
          </div>
        </section>
      )}

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          body="Add a client, then link their signup to this record."
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matches" body="Try a different search or filter." />
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <PortalCard
              key={client.id}
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600"
            >
              <div className="min-w-0 flex-1">
                <Link href={`/admin/clients/detail?id=${client.id}`}>
                  <p className="truncate text-sm font-medium hover:text-neutral-200">
                    {client.business_name}
                  </p>
                </Link>
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
                {client.access_key && (
                  <span className="hidden font-mono text-[10px] text-neutral-600 sm:inline">
                    Key: {client.access_key}
                  </span>
                )}
                {confirmDelete === client.id ? (
                  <div className="flex items-center gap-1">
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
                    onClick={() => setConfirmDelete(client.id)}
                    className="text-[10px] text-neutral-600 transition-colors hover:text-red-400"
                    title="Remove client"
                  >
                    Remove
                  </button>
                )}
              </div>
            </PortalCard>
          ))}
        </div>
      )}
    </>
  );
}

function NewClientForm({
  onCreated,
  onError,
}: {
  onCreated: (name: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!businessName.trim()) return;

    setBusy(true);
    try {
      const key = generateAccessKey();
      await createClient({
        business_name: businessName.trim(),
        contact_name: contactName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        industry: industry || undefined,
        access_key: key,
      });
      setBusinessName("");
      setContactName("");
      setEmail("");
      setPhone("");
      setIndustry("");
      await onCreated(`${businessName.trim()} (key: ${key})`);
    } catch (cause) {
      onError(
        cause instanceof Error ? cause.message : "Could not create the client."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <PortalCard>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <AdminField
          label="Business name"
          value={businessName}
          onChange={setBusinessName}
          required
        />
        <AdminField label="Contact name" value={contactName} onChange={setContactName} />
        <AdminField label="Email" type="email" value={email} onChange={setEmail} />
        <AdminField label="Phone" value={phone} onChange={setPhone} />

        <label className="text-xs text-neutral-500 sm:col-span-2">
          Industry
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-600"
          >
            <option value="">Not set</option>
            {supportedIndustries.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={busy || !businessName.trim()}
            className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Create client"}
          </button>
        </div>
      </form>
    </PortalCard>
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
