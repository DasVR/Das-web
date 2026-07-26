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
  broadcastMessage,
  fetchAllClients,
  fetchAllMessages,
} from "@/lib/admin";
import { formatDate } from "@/lib/dashboard";
import type { ClientRow, MessageRow } from "@/lib/database.types";
import { getServiceName, services } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AdminMessages() {
  return (
    <AdminGate>
      <MessagesBody />
    </AdminGate>
  );
}

type Thread = {
  client: ClientRow;
  messages: MessageRow[];
  unread: number;
  lastAt: string | null;
};

function MessagesBody() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [nextClients, nextMessages] = await Promise.all([
        fetchAllClients(),
        fetchAllMessages(),
      ]);
      setClients(nextClients);
      setMessages(nextMessages);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load messages.");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void load();
  }, [load]);

  const threads = useMemo<Thread[]>(() => {
    return clients
      .map((client) => {
        const thread = messages.filter(
          (message) => message.client_id === client.id
        );
        return {
          client,
          messages: thread,
          unread: thread.filter(
            (message) => !message.from_admin && !message.read_at
          ).length,
          lastAt: thread[0]?.created_at ?? null,
        };
      })
      .sort((a, b) => {
        if (a.unread !== b.unread) return b.unread - a.unread;
        return (b.lastAt ?? "").localeCompare(a.lastAt ?? "");
      });
  }, [clients, messages]);

  const serviceRequests = messages.filter((message) => message.service_id);

  return (
    <>
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          {threads.reduce((total, thread) => total + thread.unread, 0)} unread
        </p>
        <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
          Contact clients
        </h1>
      </header>

      {error && (
        <div className="mb-4">
          <PortalNotice tone="error">{error}</PortalNotice>
        </div>
      )}

      <section className="mb-8">
        <SectionTitle>Broadcast</SectionTitle>
        <Broadcast clients={clients} onSent={load} />
      </section>

      {serviceRequests.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Service requests</SectionTitle>
          <div className="space-y-2">
            {serviceRequests.slice(0, 6).map((message) => {
              const client = clients.find((c) => c.id === message.client_id);
              return (
                <PortalCard key={message.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm">
                      {client?.business_name ?? "Unknown"} wants{" "}
                      <span className="text-orange-400">
                        {getServiceName(message.service_id ?? "")}
                      </span>
                    </p>
                    <span className="font-mono text-[10px] text-neutral-600">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  {client && (
                    <Link
                      href={`/admin/clients/detail?id=${client.id}`}
                      className="mt-1 inline-block text-xs text-neutral-500 underline hover:text-neutral-300"
                    >
                      Open thread
                    </Link>
                  )}
                </PortalCard>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionTitle>Threads</SectionTitle>
        {threads.length === 0 ? (
          <EmptyState
            title="No clients yet"
            body={
              <>
                Add a client from{" "}
                <Link href="/admin/clients" className="underline">
                  Clients
                </Link>
                .
              </>
            }
          />
        ) : (
          <div className="space-y-2">
            {threads.map((thread) => (
              <Link
                key={thread.client.id}
                href={`/admin/clients/detail?id=${thread.client.id}`}
              >
                <PortalCard className="transition-colors hover:border-neutral-600">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {thread.client.business_name}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {thread.messages[0]?.body ?? "No messages yet"}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      {thread.unread > 0 && (
                        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-medium text-black">
                          {thread.unread}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-neutral-600">
                        {thread.lastAt ? formatDate(thread.lastAt) : "—"}
                      </span>
                    </div>
                  </div>
                </PortalCard>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Broadcast({
  clients,
  onSent,
}: {
  clients: ClientRow[];
  onSent: () => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | string>("active");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // A service filter targets clients whose projects include that service.
  const recipients = useMemo(() => {
    if (filter === "all") return clients;
    if (filter === "active")
      return clients.filter((client) => client.status === "active");
    return clients.filter((client) => client.status === "active");
  }, [clients, filter]);

  return (
    <PortalCard>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!body.trim() || recipients.length === 0) return;
          setBusy(true);
          setResult(null);
          try {
            await broadcastMessage(
              recipients.map((client) => client.id),
              body.trim()
            );
            setBody("");
            setResult(
              `Sent to ${recipients.length} client${recipients.length === 1 ? "" : "s"}.`
            );
            await onSent();
          } catch {
            setResult("Broadcast failed.");
          } finally {
            setBusy(false);
          }
        }}
        className="space-y-3"
      >
        <label className="block text-xs text-neutral-500">
          Recipients
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-600"
          >
            <option value="active">Active clients</option>
            <option value="all">All clients</option>
          </select>
        </label>

        <label className="block text-xs text-neutral-500">
          Message
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            maxLength={5000}
            placeholder="One note to every client…"
            className="mt-1 w-full resize-y rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy || !body.trim() || recipients.length === 0}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            {busy ? "Sending…" : `Send to ${recipients.length}`}
          </button>
          {result && <span className="text-xs text-neutral-500">{result}</span>}
        </div>

        <p className="text-[11px] text-neutral-700">
          Goes into each client&apos;s thread. Service catalog:{" "}
          {services.length} offerings.
        </p>
      </form>
    </PortalCard>
  );
}
