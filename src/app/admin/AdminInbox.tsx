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
  OnboardClientDialog,
  type OnboardPrefill,
} from "@/components/admin/OnboardClientDialog";
import {
  broadcastMessage,
  fetchAdminOverview,
  fetchAllMessages,
  fetchLeads,
  reviewAccessRequest,
  setLeadStatus,
  type AdminOverview,
} from "@/lib/admin";
import { formatDate } from "@/lib/dashboard";
import type {
  CarePlanRow,
  ClientRow,
  LeadRow,
  MessageRow,
  ProjectRow,
  UpdateRow,
} from "@/lib/database.types";
import { getServiceName, services } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AdminInbox() {
  return (
    <AdminGate>
      <InboxBody />
    </AdminGate>
  );
}

type FeedItem =
  | { kind: "lead"; at: string; lead: LeadRow }
  | { kind: "message"; at: string; message: MessageRow; client?: ClientRow }
  | { kind: "update"; at: string; update: UpdateRow; project?: ProjectRow; client?: ClientRow }
  | { kind: "renewal"; at: string; plan: CarePlanRow; client?: ClientRow };

function InboxBody() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [allMessages, setAllMessages] = useState<MessageRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<"new" | "contacted" | "converted" | "archived">("new");
  const [onboardPrefill, setOnboardPrefill] = useState<OnboardPrefill | null>(null);

  const load = useCallback(async () => {
    try {
      const [nextOverview, nextLeads, nextMessages] = await Promise.all([
        fetchAdminOverview(),
        fetchLeads(),
        fetchAllMessages(),
      ]);
      setOverview(nextOverview);
      setLeads(nextLeads);
      setAllMessages(nextMessages);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load data.");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void load();
  }, [load]);

  const clientById = useMemo(() => {
    const map = new Map<string, ClientRow>();
    for (const client of overview?.clients ?? []) map.set(client.id, client);
    return map;
  }, [overview]);

  const projectById = useMemo(() => {
    const map = new Map<string, ProjectRow>();
    for (const project of overview?.projects ?? []) map.set(project.id, project);
    return map;
  }, [overview]);

  const feed = useMemo<FeedItem[]>(() => {
    if (!overview) return [];

    const items: FeedItem[] = [
      ...leads
        .filter((lead) => lead.status === "new")
        .map((lead): FeedItem => ({ kind: "lead", at: lead.created_at, lead })),
      ...overview.unreadMessages.map((message): FeedItem => ({
        kind: "message",
        at: message.created_at,
        message,
        client: clientById.get(message.client_id),
      })),
      ...overview.openUpdates.map((update): FeedItem => ({
        kind: "update",
        at: update.created_at,
        update,
        project: projectById.get(update.project_id),
        client: projectById.get(update.project_id)
          ? clientById.get(projectById.get(update.project_id)!.client_id)
          : undefined,
      })),
      ...overview.renewals
        .filter((plan) => plan.renews_at)
        .map((plan): FeedItem => ({
          kind: "renewal",
          at: plan.renews_at as string,
          plan,
          client: clientById.get(plan.client_id),
        })),
    ];

    return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
  }, [overview, leads, clientById, projectById]);

  const threads = useMemo(() => {
    return (overview?.clients ?? [])
      .map((client) => {
        const thread = allMessages.filter((message) => message.client_id === client.id);
        return {
          client,
          last: thread[0] ?? null,
          unread: thread.filter((message) => !message.from_admin && !message.read_at).length,
        };
      })
      .filter((thread) => thread.last)
      .sort((a, b) => {
        if (a.unread !== b.unread) return b.unread - a.unread;
        return (b.last?.created_at ?? "").localeCompare(a.last?.created_at ?? "");
      })
      .slice(0, 6);
  }, [overview, allMessages]);

  const filteredLeads = leads.filter((lead) => lead.status === leadFilter);
  const pendingRequests = overview?.pendingRequests ?? [];

  if (error) return <PortalNotice tone="error">{error}</PortalNotice>;
  if (!overview) return <p className="text-sm text-neutral-500">Loading…</p>;

  const activeClients = overview.clients.filter((client) => client.status === "active");

  const stats = [
    { label: "Active clients", value: activeClients.length, href: "/admin/clients" },
    { label: "Open items", value: overview.openUpdates.length, href: "/admin/projects" },
    { label: "Unread messages", value: overview.unreadMessages.length, href: "/admin/clients" },
    { label: "New leads", value: leads.filter((l) => l.status === "new").length, href: "#leads" },
  ];

  return (
    <>
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          DasDev admin
        </p>
        <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
          Inbox
        </h1>
      </header>

      {notice && (
        <div className="mb-4">
          <PortalNotice tone="success">{notice}</PortalNotice>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <PortalCard className="transition-colors hover:border-neutral-600">
              <p className="text-xl font-medium sm:text-2xl">{stat.value}</p>
              <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">
                {stat.label}
              </p>
            </PortalCard>
          </Link>
        ))}
      </div>

      <section className="mb-8">
        <SectionTitle>Needs your attention</SectionTitle>
        {feed.length === 0 ? (
          <EmptyState title="All caught up" body="New leads, messages, and open items land here." />
        ) : (
          <div className="space-y-2">
            {feed.map((item) => (
              <FeedRow
                key={`${item.kind}-${item.at}-${
                  item.kind === "lead"
                    ? item.lead.id
                    : item.kind === "message"
                      ? item.message.id
                      : item.kind === "update"
                        ? item.update.id
                        : item.plan.id
                }`}
                item={item}
                onConvert={(lead) =>
                  setOnboardPrefill({
                    leadId: lead.id,
                    businessName: lead.name,
                    contactName: lead.name,
                    email: lead.email,
                  })
                }
                onMarkContacted={async (lead) => {
                  await setLeadStatus(lead.id, "contacted");
                  await load();
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle
          action={
            <span className="font-mono text-[10px] text-neutral-600">
              {threads.length}
            </span>
          }
        >
          Recent conversations
        </SectionTitle>
        {threads.length === 0 ? (
          <EmptyState title="No conversations yet" body="Client messages appear here as they come in." />
        ) : (
          <div className="space-y-2">
            {threads.map((thread) => (
              <Link
                key={thread.client.id}
                href={`/admin/clients/detail?id=${thread.client.id}&tab=messages`}
              >
                <PortalCard className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {thread.client.business_name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {thread.last?.body ?? ""}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {thread.unread > 0 && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-medium text-black">
                        {thread.unread}
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-neutral-600">
                      {thread.last ? formatDate(thread.last.created_at) : "—"}
                    </span>
                  </div>
                </PortalCard>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="leads" className="mb-8 scroll-mt-6">
        <SectionTitle
          action={
            <div className="flex gap-1">
              {(["new", "contacted", "converted", "archived"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLeadFilter(f)}
                  className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                    leadFilter === f
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        >
          Leads
        </SectionTitle>
        {filteredLeads.length === 0 ? (
          <EmptyState
            title={`No ${leadFilter} leads`}
            body={
              <>
                Submissions from{" "}
                <Link href="/contact" className="underline">
                  the contact page
                </Link>{" "}
                land here.
              </>
            }
          />
        ) : (
          <div className="space-y-2">
            {filteredLeads.map((lead) => (
              <PortalCard key={lead.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {lead.name}{" "}
                      <span className="font-normal text-neutral-500">
                        · {lead.email}
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                      {lead.message}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-neutral-600">
                      {formatDate(lead.created_at)} · {lead.source}
                      {lead.service_id ? ` · ${getServiceName(lead.service_id)}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    {lead.status === "new" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await setLeadStatus(lead.id, "contacted");
                          await load();
                        }}
                        className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-600"
                      >
                        Mark contacted
                      </button>
                    )}
                    {lead.status !== "converted" && (
                      <button
                        type="button"
                        onClick={() =>
                          setOnboardPrefill({
                            leadId: lead.id,
                            businessName: lead.name,
                            contactName: lead.name,
                            email: lead.email,
                          })
                        }
                        className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-200"
                      >
                        Convert to client
                      </button>
                    )}
                    {lead.status !== "archived" && lead.status !== "converted" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await setLeadStatus(lead.id, "archived");
                          await load();
                        }}
                        className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-neutral-600"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              </PortalCard>
            ))}
          </div>
        )}
      </section>

      <details className="mb-8 rounded-lg border border-neutral-900 open:bg-[#0d0d0d]">
        <summary className="cursor-pointer select-none px-4 py-3 text-xs font-medium text-neutral-400">
          Message everyone
        </summary>
        <div className="px-4 pb-4">
          <Broadcast clients={overview.clients} onSent={load} />
        </div>
      </details>

      {pendingRequests.length > 0 && (
        <details className="mb-8 rounded-lg border border-neutral-900 open:bg-[#0d0d0d]">
          <summary className="cursor-pointer select-none px-4 py-3 text-xs font-medium text-neutral-400">
            Legacy access requests ({pendingRequests.length})
          </summary>
          <div className="space-y-2 px-4 pb-4">
            <p className="text-[11px] text-neutral-600">
              Left over from the old public signup flow. Access-key activation
              replaced this, so new rows should not normally appear here.
            </p>
            {pendingRequests.map((request) => (
              <PortalCard key={request.id} className="px-4 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm">{request.business_name}</p>
                    <p className="text-[11px] text-neutral-600">
                      Requested {formatDate(request.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await reviewAccessRequest(request.id, "denied");
                        await load();
                      }}
                      className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </PortalCard>
            ))}
          </div>
        </details>
      )}

      <OnboardClientDialog
        open={Boolean(onboardPrefill)}
        prefill={onboardPrefill ?? undefined}
        onClose={() => setOnboardPrefill(null)}
        onDone={async () => {
          setNotice("Client created.");
          await load();
        }}
      />
    </>
  );
}

function FeedRow({
  item,
  onConvert,
  onMarkContacted,
}: {
  item: FeedItem;
  onConvert: (lead: LeadRow) => void;
  onMarkContacted: (lead: LeadRow) => Promise<void>;
}) {
  if (item.kind === "lead") {
    return (
      <PortalCard className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm">
            New lead: <span className="font-medium">{item.lead.name}</span>
          </p>
          <p className="truncate text-xs text-neutral-500">{item.lead.email}</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onMarkContacted(item.lead)}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-600"
          >
            Mark contacted
          </button>
          <button
            type="button"
            onClick={() => onConvert(item.lead)}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Convert
          </button>
        </div>
      </PortalCard>
    );
  }

  if (item.kind === "message") {
    return (
      <Link href={`/admin/clients/detail?id=${item.message.client_id}&tab=messages`}>
        <PortalCard className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600">
          <div className="min-w-0">
            <p className="truncate text-sm">
              {item.client?.business_name ?? "A client"} sent a message
            </p>
            <p className="truncate text-xs text-neutral-500">{item.message.body}</p>
          </div>
          <span className="flex-shrink-0 text-xs text-neutral-500">Reply →</span>
        </PortalCard>
      </Link>
    );
  }

  if (item.kind === "update") {
    return (
      <Link
        href={
          item.client
            ? `/admin/clients/detail?id=${item.client.id}&tab=projects`
            : "/admin/projects"
        }
      >
        <PortalCard className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600">
          <div className="min-w-0">
            <p className="truncate text-sm">
              {item.project?.name ?? "A project"} has an open item
            </p>
            <p className="truncate text-xs text-neutral-500">{item.update.body}</p>
          </div>
          <span className="flex-shrink-0 text-xs text-neutral-500">Open →</span>
        </PortalCard>
      </Link>
    );
  }

  return (
    <PortalCard className="flex items-center justify-between gap-3 px-4 py-3">
      <p className="truncate text-sm">
        {item.client?.business_name ?? "A client"} care plan renews{" "}
        {formatDate(item.plan.renews_at)}
      </p>
    </PortalCard>
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
  const [filter, setFilter] = useState<"all" | "active">("active");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const recipients =
    filter === "all" ? clients : clients.filter((client) => client.status === "active");

  return (
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
          setResult(`Sent to ${recipients.length} client${recipients.length === 1 ? "" : "s"}.`);
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
          onChange={(event) => setFilter(event.target.value as "all" | "active")}
          className="mt-1 w-full rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
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
          className="mt-1 w-full resize-y rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
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
        Goes into each client&apos;s thread. Service catalog: {services.length} offerings.
      </p>
    </form>
  );
}
