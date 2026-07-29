"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminGate } from "@/components/portal/AdminGate";
import { EmptyState, PortalNotice } from "@/components/portal/PortalShell";
import { Tabs, type TabItem } from "@/components/portal/Tabs";
import { ClientHubAccessTab } from "@/components/admin/client-hub/ClientHubAccessTab";
import { ClientHubCareTab } from "@/components/admin/client-hub/ClientHubCareTab";
import { ClientHubMessagesTab } from "@/components/admin/client-hub/ClientHubMessagesTab";
import { ClientHubOverviewTab } from "@/components/admin/client-hub/ClientHubOverviewTab";
import { ClientHubProjectsTab } from "@/components/admin/client-hub/ClientHubProjectsTab";
import {
  deleteClient,
  fetchClientDetail,
  markClientMessagesRead,
  type AdminClientDetail as Detail,
} from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/supabase";

type TabId = "overview" | "projects" | "care" | "messages" | "access";

export function AdminClientDetail() {
  return (
    <AdminGate>
      {/* useSearchParams needs a boundary in a statically exported page. */}
      <Suspense
        fallback={<p className="text-sm text-neutral-500">Loading client…</p>}
      >
        <DetailBody />
      </Suspense>
    </AdminGate>
  );
}

function DetailBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const requestedTab = searchParams.get("tab") as TabId | null;

  const [detail, setDetail] = useState<Detail | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>(requestedTab ?? "overview");

  const load = useCallback(async () => {
    if (!clientId) {
      setState("missing");
      return;
    }
    try {
      const next = await fetchClientDetail(clientId);
      setDetail(next);
      setState(next ? "ready" : "missing");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load client.");
    }
  }, [clientId]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void load();
  }, [load]);

  // Opening the record counts as reading the thread.
  useEffect(() => {
    if (!detail) return;
    const unread = detail.messages.some(
      (message) => !message.from_admin && !message.read_at
    );
    if (unread) void markClientMessagesRead(detail.client.id).catch(() => undefined);
  }, [detail]);

  if (error) return <PortalNotice tone="error">{error}</PortalNotice>;

  if (state === "missing") {
    return (
      <EmptyState
        title="Client not found"
        body={
          <>
            Pick one from{" "}
            <Link href="/admin/clients" className="underline">
              Clients
            </Link>
            .
          </>
        }
      />
    );
  }

  if (state === "loading" || !detail) {
    return <p className="text-sm text-neutral-500">Loading client…</p>;
  }

  const { client, projects, updates, care, messages, members } = detail;
  const unreadCount = messages.filter((m) => !m.from_admin && !m.read_at).length;
  const inReviewCount = projects.filter((p) => p.status === "in review").length;

  const tabItems: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects", badge: inReviewCount },
    { id: "care", label: "Care & billing" },
    { id: "messages", label: "Messages", badge: unreadCount },
    { id: "access", label: "Access" },
  ];

  function changeTab(next: string) {
    setTab(next as TabId);
    router.replace(`/admin/clients/detail?id=${clientId}&tab=${next}`, { scroll: false });
  }

  return (
    <>
      <nav className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/clients"
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          ← Clients
        </Link>
        <button
          type="button"
          onClick={async () => {
            if (!confirm(`Remove ${client.business_name}? This cannot be undone.`)) return;
            try {
              await deleteClient(client.id);
              window.location.href = "/admin/clients";
            } catch {
              setError("Could not remove client.");
            }
          }}
          className="text-xs text-neutral-600 transition-colors hover:text-red-400"
        >
          Remove client
        </button>
      </nav>

      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          {client.industry ?? "Client"} · {client.status}
        </p>
        <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
          {client.business_name}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {[client.contact_name, client.email, client.phone]
            .filter(Boolean)
            .join(" · ") || "No contact details"}
        </p>
      </header>

      <Tabs items={tabItems} active={tab} onChange={changeTab} />

      {tab === "overview" && <ClientHubOverviewTab client={client} onChanged={load} />}
      {tab === "projects" && (
        <ClientHubProjectsTab
          clientId={client.id}
          clientName={client.business_name}
          projects={projects}
          updates={updates}
          onChanged={load}
        />
      )}
      {tab === "care" && (
        <ClientHubCareTab clientId={client.id} care={care} onChanged={load} />
      )}
      {tab === "messages" && (
        <ClientHubMessagesTab
          clientId={client.id}
          clientName={client.business_name}
          messages={messages}
          onChanged={load}
        />
      )}
      {tab === "access" && (
        <ClientHubAccessTab client={client} members={members} onChanged={load} />
      )}
    </>
  );
}
