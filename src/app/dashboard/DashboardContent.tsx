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
import { useRequireAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getServiceName, services } from "@/lib/services";
import {
  acknowledgeUpdate,
  allUpdates,
  fetchWorkspace,
  formatBytes,
  formatDate,
  markMessagesRead,
  projectStatusCounts,
  sendClientMessage,
  signedFileUrl,
  statusBadgeClass,
  supportedIndustries,
  type ClientWorkspace,
} from "@/lib/dashboard";

const navLinks = [{ href: "/dashboard", label: "Workspace" }];

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
  const counts = useMemo(() => projectStatusCounts(projects), [projects]);
  const updates = useMemo(() => allUpdates(workspace), [workspace]);
  const openUpdates = updates.filter((update) => !update.done);

  const engaged = useMemo(() => {
    const ids = new Set(projects.flatMap((project) => project.services));
    return Array.from(ids);
  }, [projects]);

  const available = services.filter((service) => !engaged.includes(service.id));

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

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { label: "Live", count: counts.live },
            { label: "In progress", count: counts["in progress"] },
            { label: "In review", count: counts["in review"] },
            { label: "Open items", count: openUpdates.length },
          ] as const
        ).map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
          >
            <PortalCard className="p-3 sm:p-4">
              <p className="text-xl font-medium sm:text-2xl">{stat.count}</p>
              <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">
                {stat.label}
              </p>
            </PortalCard>
          </motion.div>
        ))}
      </div>

      <section className="mb-8">
        <SectionTitle
          action={
            <span className="font-mono text-[10px] text-neutral-600">
              {projects.length} total
            </span>
          }
        >
          Projects
        </SectionTitle>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Your first project will appear here once it kicks off."
          />
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {projects.map((project) => (
              <PortalCard key={project.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {project.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-neutral-300"
                        >
                          {project.url}
                        </a>
                      ) : (
                        "URL pending"
                      )}
                      {project.note ? ` · ${project.note}` : ""}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadgeClass(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                {project.services.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.services.map((serviceId) => (
                      <span
                        key={serviceId}
                        className="rounded border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-400"
                      >
                        {getServiceName(serviceId)}
                      </span>
                    ))}
                  </div>
                )}
              </PortalCard>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle>Updates</SectionTitle>
        {updates.length === 0 ? (
          <EmptyState
            title="Nothing needs you right now"
            body="Action items and progress notes show up here."
          />
        ) : (
          <div className="space-y-2">
            {updates.map((update) => (
              <PortalCard key={update.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border ${
                      update.done
                        ? "border-green-500 bg-green-500"
                        : "border-neutral-600"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm leading-snug ${
                        update.done ? "text-neutral-500 line-through" : "text-white"
                      }`}
                    >
                      {update.body}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-600">
                      {update.due_date
                        ? `Due ${formatDate(update.due_date)}`
                        : formatDate(update.created_at)}
                      {update.acknowledged_at ? " · acknowledged" : ""}
                    </p>
                  </div>
                  {!update.done && !update.acknowledged_at && (
                    <button
                      type="button"
                      onClick={async () => {
                        await acknowledgeUpdate(update.id);
                        await onChanged();
                      }}
                      className="flex-shrink-0 rounded border border-neutral-700 px-2 py-1 text-[11px] text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </PortalCard>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle>Care plan</SectionTitle>
        <PortalCard>
          {care?.active ? (
            <>
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
            </>
          ) : (
            <p className="text-sm text-neutral-400">
              No care plan yet.{" "}
              <Link href="/contact" className="text-neutral-300 underline">
                Ask about Maintenance
              </Link>
              .
            </p>
          )}
        </PortalCard>
      </section>

      <section className="mb-8">
        <SectionTitle>Files</SectionTitle>
        {files.length === 0 ? (
          <EmptyState
            title="No deliverables yet"
            body="Logos, exports, and handoff files will be downloadable here."
          />
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <PortalCard
                key={file.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{file.label}</p>
                  <p className="text-[11px] text-neutral-600">
                    {formatBytes(file.size_bytes)} ·{" "}
                    {formatDate(file.created_at)}
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
              </PortalCard>
            ))}
          </div>
        )}
      </section>

      <MessageThread
        clientId={client.id}
        messages={workspace.messages}
        onSent={onChanged}
      />

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
          Your services
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

        {available.length > 0 && (
          <>
            <p className="mb-2 text-xs text-neutral-500">
              Add on. Ask and it lands in our thread above.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {available.slice(0, 6).map((service) => (
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
          </>
        )}
      </section>

      <footer className="border-t border-neutral-900 pt-6">
        <p className="text-xs text-neutral-600">
          Built for broad small business work:{" "}
          {supportedIndustries.slice(0, 4).join(", ")}, and more.
        </p>
      </footer>
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
    <section className="mb-8">
      <SectionTitle>Messages</SectionTitle>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            body="Ask a question or request a change. It reaches me directly."
          />
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

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
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
    </section>
  );
}
