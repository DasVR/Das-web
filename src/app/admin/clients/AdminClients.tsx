"use client";

import { useCallback, useEffect, useState } from "react";
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
  fetchAllClients,
  fetchUnassignedProfiles,
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

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
            {clients.length} total
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

      {pending.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Accounts waiting for a workspace</SectionTitle>
          <p className="mb-3 text-xs text-neutral-500">
            These people signed up but cannot see anything until you link them to
            a client.
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
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <Link key={client.id} href={`/admin/clients/detail?id=${client.id}`}>
              <PortalCard className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {client.business_name}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {[client.contact_name, client.email, client.industry]
                      .filter(Boolean)
                      .join(" · ") || "No contact details"}
                  </p>
                </div>
                <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                  {client.status}
                </span>
              </PortalCard>
            </Link>
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
      await createClient({
        business_name: businessName.trim(),
        contact_name: contactName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        industry: industry || undefined,
      });
      setBusinessName("");
      setContactName("");
      setEmail("");
      setPhone("");
      setIndustry("");
      await onCreated(businessName.trim());
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
