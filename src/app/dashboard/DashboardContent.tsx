"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Send } from "lucide-react";
import {
  EmptyState,
  PortalCard,
  PortalNotice,
  PortalShell,
  SectionTitle,
} from "@/components/portal/PortalShell";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { useRequireAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getServiceName, services, type ServiceCategory } from "@/lib/services";
import {
  acknowledgeUpdate,
  fetchWorkspace,
  formatBytes,
  formatDate,
  markMessagesRead,
  sendClientMessage,
  signedFileUrl,
  type ClientWorkspace,
  type ProjectWithUpdates,
} from "@/lib/dashboard";
import type { UpdateRow } from "@/lib/database.types";

const navLinks = [{ href: "/dashboard", label: "Workspace" }];

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  build: "Build something new",
  grow: "Grow what you have",
  care: "Keep it running",
  special: "Something different",
};

export function DashboardContent() {
  const { allowed, loading, role, profile, session } = useRequireAuth();
  const [workspace, setWorkspace] = useState<ClientWorkspace | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setWorkspace(await fetchWorkspace());
      setState("ready");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load your workspace."
      );
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !allowed) return;
    void load();
  }, [allowed, load]);

  if (!isSupabaseConfigured) {
    return (
      <PortalShell links={navLinks} label="Client workspace">
        <PortalNotice tone="info">
          The portal is not connected to a backend yet. See supabase/README.md
          for setup.
        </PortalNotice>
      </PortalShell>
    );
  }

  if (loading || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
        Checking your session…
      </div>
    );
  }

  return (
    <PortalShell links={navLinks} label="Client workspace">
      {role === "admin" && (
        <div className="mb-6">
          <PortalNotice tone="info">
            You are signed in as admin.{" "}
            <Link href="/admin" className="underline">
              Go to the admin dashboard
            </Link>
            .
          </PortalNotice>
        </div>
      )}

      {state === "loading" && (
        <p className="text-sm text-neutral-500">Loading your workspace…</p>
      )}

      {state === "error" && (
        <PortalNotice tone="error">{errorMessage}</PortalNotice>
      )}

      {state === "ready" && !workspace && (
        <EmptyState
          title="Your workspace is being set up"
          body={
            <>
              Your account is active but not linked to a project yet. I will
              email {session?.user.email} the moment it is ready. Questions?{" "}
              <Link href="/contact" className="underline">
                Get in touch
              </Link>
              .
            </>
          }
        />
      )}

      {state === "ready" && workspace && (
        <Workspace
          workspace={workspace}
          greetingName={profile?.full_name ?? workspace.client.contact_name}
          onChanged={load}
        />
      )}
    </PortalShell>
  );
}

type AttentionItem =
  | { kind: "update"; update: UpdateRow; project: ProjectWithUpdates }
  | { kind: "review"; project: ProjectWithUpdates };

function Workspace({
  workspace,
  greetingName,
  onChanged,
}: {
  workspace: ClientWorkspace;
  greetingName: string | null;
  onChanged: () => Promise<void>;
}) {
  const { client, projects, care, messages, files } = workspace;
  const generalFiles = useMemo(
    () => files.filter((file) => !file.project_id),
    [files]
  );

  const attentionItems = useMemo<AttentionItem[]>(() => {
    const items: AttentionItem[] = [];
    for (const project of projects) {
      const open = project.updates.filter((update) => !update.done);
      for (const update of open) items.push({ kind: "update", update, project });
      if (project.status === "in review" && open.length === 0) {
        items.push({ kind: "review", project });
      }
    }
    return items;
  }, [projects]);

  const engaged = useMemo(() => {
    const ids = new Set(projects.flatMap((project) => project.services));
    return Array.from(ids);
  }, [projects]);

  const availableByCategory = useMemo(() => {
    const available = services.filter((service) => !engaged.includes(service.id));
    const grouped: Record<ServiceCategory, typeof services> = {
      build: [],
      grow: [],
      care: [],
      special: [],
    };
    for (const service of available) grouped[service.category].push(service);
    return grouped;
  }, [engaged]);

  // Clear the unread badge once the thread has actually been rendered.
  useEffect(() => {
    const unread = messages.some(
      (message) => message.from_admin && !message.read_at
    );
    if (unread) void markMessagesRead(client.id).catch(() => undefined);
  }, [client.id, messages]);

  return (
    <>
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          {client.industry ?? "Client"}
          {client.since ? ` · since ${client.since}` : ""}
        </p>
        <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
          {client.business_name}
        </h1>
        {greetingName && (
          <p className="mt-1 text-sm text-neutral-500">Hi {greetingName}.</p>
        )}
      </header>

      <section className="mb-8">
        <SectionTitle>Needs your attention</SectionTitle>
        {attentionItems.length === 0 ? (
          <EmptyState
            title="Nothing needs you right now"
            body="Action items and progress notes show up here the moment they do."
          />
        ) : (
          <div className="space-y-2">
            {attentionItems.map((item) =>
              item.kind === "update" ? (
                <motion.div
                  key={item.update.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <PortalCard className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border border-orange-500 bg-orange-500/40" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-neutral-500">{item.project.name}</p>
                        <p className="text-sm leading-snug text-white">{item.update.body}</p>
                        <p className="mt-1 text-[11px] text-neutral-600">
                          {item.update.due_date
                            ? `Due ${formatDate(item.update.due_date)}`
                            : formatDate(item.update.created_at)}
                        </p>
                      </div>
                      {!item.update.acknowledged_at && (
                        <button
                          type="button"
                          onClick={async () => {
                            await acknowledgeUpdate(item.update.id);
                            await onChanged();
                          }}
                          className="flex-shrink-0 rounded border border-neutral-700 px-2 py-1 text-[11px] text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
                        >
                          Got it
                        </button>
                      )}
                    </div>
                  </PortalCard>
                </motion.div>
              ) : (
                <Link key={item.project.id} href={`/dashboard/projects?id=${item.project.id}`}>
                  <PortalCard className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600">
                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        <span className="font-medium">{item.project.name}</span> is waiting
                        on your OK
                      </p>
                    </div>
                    <StatusBadge status={item.project.status} audience="client" />
                  </PortalCard>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle
          action={
            <span className="font-mono text-[10px] text-neutral-600">
              {projects.length} total
            </span>
          }
        >
          Your projects
        </SectionTitle>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Your first project will appear here once it kicks off."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => {
              const openCount = project.updates.filter((u) => !u.done).length;
              return (
                <Link key={project.id} href={`/dashboard/projects?id=${project.id}`}>
                  <PortalCard className="h-full transition-colors hover:border-neutral-600">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium">{project.name}</p>
                      <StatusBadge status={project.status} audience="client" />
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                      {project.services.length} service
                      {project.services.length === 1 ? "" : "s"}
                      {openCount > 0
                        ? ` · ${openCount} open item${openCount === 1 ? "" : "s"}`
                        : ""}
                    </p>
                    <p className="mt-3 text-xs text-neutral-400 group-hover:text-neutral-200">
                      View full details →
                    </p>
                  </PortalCard>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle>Care & support</SectionTitle>
        <PortalCard>
          {care?.active ? (
            <div className="mb-4 border-b border-neutral-900 pb-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{care.plan}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-green-400">
                  Active
                  {care.renews_at ? ` · renews ${formatDate(care.renews_at)}` : ""}
                </p>
              </div>
              {care.included.length > 0 && (
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {care.included.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-neutral-400 before:mr-2 before:text-neutral-600 before:content-['·']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mb-4 border-b border-neutral-900 pb-4 text-sm text-neutral-400">
              No care plan yet.{" "}
              <Link href="/contact" className="text-neutral-300 underline">
                Ask about Maintenance
              </Link>
              .
            </p>
          )}
          {generalFiles.length > 0 && (
            <div className="mb-4 space-y-2 border-b border-neutral-900 pb-4">
              <p className="text-xs text-neutral-500">Files</p>
              {generalFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">{file.label}</p>
                    <p className="text-[11px] text-neutral-600">
                      {formatBytes(file.size_bytes)} · {formatDate(file.created_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const url = await signedFileUrl(file.storage_path);
                      if (url) window.open(url, "_blank", "noopener");
                    }}
                    className="flex flex-shrink-0 items-center gap-1.5 rounded border border-neutral-700 px-2.5 py-1.5 text-[11px] text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
                  >
                    <Download className="size-3" aria-hidden="true" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
          <MessageThread clientId={client.id} messages={messages} onSent={onChanged} />
        </PortalCard>
      </section>

      <section className="mb-8">
        <SectionTitle
          action={
            <Link
              href="/services"
              className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Full menu
            </Link>
          }
        >
          Explore services
        </SectionTitle>

        {engaged.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {engaged.map((serviceId) => (
              <span
                key={serviceId}
                className="rounded-md border border-neutral-800 bg-[#111] px-3 py-1.5 text-xs text-neutral-300"
              >
                {getServiceName(serviceId)}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-6">
          {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map((category) => {
            const items = availableByCategory[category];
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <p className="mb-2 text-xs text-neutral-500">
                  {CATEGORY_LABELS[category]}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={async () => {
                        await sendClientMessage(
                          client.id,
                          `I would like to add ${service.name}.`,
                          service.id
                        );
                        await onChanged();
                      }}
                      className="group rounded-lg border border-neutral-800 bg-[#0e0e0e] px-3 py-3 text-left transition-colors hover:border-neutral-600"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium group-hover:text-white">
                          {service.name}
                        </p>
                        <span className="font-mono text-[10px] text-orange-400/80">
                          {service.price}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                        {service.detail}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function MessageThread({
  clientId,
  messages,
  onSent,
}: {
  clientId: string;
  messages: ClientWorkspace["messages"];
  onSent: () => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;

    setBusy(true);
    setError(null);
    try {
      await sendClientMessage(clientId, body.trim());
      setBody("");
      await onSent();
    } catch {
      setError("Message did not send. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-3 max-h-72 space-y-2 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-xs text-neutral-500">
            Ask a question or request a change. It reaches DasDev directly.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-lg border px-3 py-2 ${
                message.from_admin
                  ? "border-neutral-800 bg-[#111]"
                  : "ml-auto border-neutral-700 bg-neutral-900"
              }`}
            >
              <p className="text-sm leading-relaxed text-neutral-200">
                {message.body}
              </p>
              <p className="mt-1 font-mono text-[10px] text-neutral-600">
                {message.from_admin ? "DasDev" : "You"} ·{" "}
                {formatDate(message.created_at)}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <label htmlFor="message-body" className="sr-only">
          Message
        </label>
        <input
          id="message-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ask a question or request a change…"
          maxLength={5000}
          className="flex-1 rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="flex items-center gap-1.5 rounded-md bg-white px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
        >
          <Send className="size-3.5" aria-hidden="true" />
          Send
        </button>
      </form>

      {error && (
        <div className="mt-2">
          <PortalNotice tone="error">{error}</PortalNotice>
        </div>
      )}
    </div>
  );
}
