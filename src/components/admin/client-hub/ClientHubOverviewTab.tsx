"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminField } from "@/app/admin/clients/AdminClients";
import { PortalCard, SectionTitle } from "@/components/portal/PortalShell";
import { generateAccessKey, setClientAccessKey, updateClient } from "@/lib/admin";
import { supportedIndustries } from "@/lib/dashboard";
import type { ClientRow } from "@/lib/database.types";

const statuses = ["active", "paused", "archived"] as const;

export function ClientHubOverviewTab({
  client,
  onChanged,
}: {
  client: ClientRow;
  onChanged: () => Promise<void>;
}) {
  return (
    <>
      <section className="mb-8">
        <SectionTitle>Status</SectionTitle>
        <PortalCard>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={async () => {
                  await updateClient(client.id, { status });
                  await onChanged();
                }}
                className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                  client.status === status
                    ? "bg-neutral-800 text-white"
                    : "border border-neutral-800 text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </PortalCard>
      </section>

      <section className="mb-8">
        <SectionTitle>Contact info</SectionTitle>
        <ContactInfoForm client={client} onSaved={onChanged} />
      </section>

      <section className="mb-8">
        <SectionTitle>Internal notes</SectionTitle>
        <NotesForm client={client} onSaved={onChanged} />
      </section>

      <section>
        <SectionTitle
          action={
            <button
              type="button"
              onClick={async () => {
                const key = generateAccessKey();
                await setClientAccessKey(client.id, key);
                await onChanged();
              }}
              className="rounded-md border border-neutral-800 px-3 py-1.5 text-[10px] text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
            >
              {client.access_key ? "Regenerate key" : "Generate key"}
            </button>
          }
        >
          Access key
        </SectionTitle>
        <PortalCard>
          {client.access_key ? (
            <div className="space-y-2">
              <p className="font-mono text-xl tracking-widest text-orange-400">
                {client.access_key}
              </p>
              <p className="text-xs text-neutral-500">
                Share this with{" "}
                {client.contact_name || client.business_name}. They enter it at{" "}
                <Link href="/dashboard/login" className="underline">
                  dasdev.net/dashboard/login
                </Link>{" "}
                to activate their workspace.
              </p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(client.access_key ?? "")}
                className="text-[10px] text-neutral-400 transition-colors hover:text-neutral-200"
              >
                Copy key
              </button>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">
              No active key. Generate one so{" "}
              {client.contact_name || "the client"} can activate their
              workspace.
            </p>
          )}
        </PortalCard>
      </section>
    </>
  );
}

function ContactInfoForm({
  client,
  onSaved,
}: {
  client: ClientRow;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [businessName, setBusinessName] = useState(client.business_name);
  const [contactName, setContactName] = useState(client.contact_name ?? "");
  const [email, setEmail] = useState(client.email ?? "");
  const [phone, setPhone] = useState(client.phone ?? "");
  const [industry, setIndustry] = useState(client.industry ?? "");
  const [busy, setBusy] = useState(false);

  if (!editing) {
    return (
      <PortalCard>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">{client.business_name}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {[client.contact_name, client.email, client.phone]
                .filter(Boolean)
                .join(" · ") || "No contact details"}
            </p>
            {client.industry && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                {client.industry}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex-shrink-0 rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
          >
            Edit
          </button>
        </div>
      </PortalCard>
    );
  }

  return (
    <PortalCard>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!businessName.trim()) return;
          setBusy(true);
          try {
            await updateClient(client.id, {
              business_name: businessName.trim(),
              contact_name: contactName.trim() || null,
              email: email.trim() || null,
              phone: phone.trim() || null,
              industry: industry || null,
            });
            setEditing(false);
            await onSaved();
          } finally {
            setBusy(false);
          }
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <AdminField label="Business name" value={businessName} onChange={setBusinessName} required />
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
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={busy || !businessName.trim()}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </PortalCard>
  );
}

function NotesForm({
  client,
  onSaved,
}: {
  client: ClientRow;
  onSaved: () => Promise<void>;
}) {
  const [notes, setNotes] = useState(client.notes ?? "");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <PortalCard>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          try {
            await updateClient(client.id, { notes: notes.trim() || null });
            setSaved(true);
            await onSaved();
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="sr-only" htmlFor="client-notes">
          Internal notes
        </label>
        <textarea
          id="client-notes"
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value);
            setSaved(false);
          }}
          rows={4}
          placeholder="Only DasDev staff see this — pricing agreements, quirks, reminders…"
          className="w-full resize-y rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-600 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save notes"}
          </button>
          {saved && <span className="text-xs text-green-400">Saved.</span>}
        </div>
      </form>
    </PortalCard>
  );
}
