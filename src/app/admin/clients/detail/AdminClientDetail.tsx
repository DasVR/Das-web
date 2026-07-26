"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminGate } from "@/components/portal/AdminGate";
import {
  EmptyState,
  PortalCard,
  PortalNotice,
  SectionTitle,
} from "@/components/portal/PortalShell";
import { AdminField } from "@/app/admin/clients/AdminClients";
import {
  createProject,
  createUpdate,
  fetchClientDetail,
  markClientMessagesRead,
  sendAdminMessage,
  setProjectStatus,
  toggleUpdateDone,
  updateClient,
  upsertCarePlan,
  type AdminClientDetail as Detail,
} from "@/lib/admin";
import { formatDate, statusBadgeClass } from "@/lib/dashboard";
import type { ProjectStatus } from "@/lib/database.types";
import { getServiceName, services } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase";

const statuses: ProjectStatus[] = ["queued", "in progress", "in review", "live"];

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
  const clientId = useSearchParams().get("id");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <nav className="mb-4">
        <Link
          href="/admin/clients"
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          ← Clients
        </Link>
      </nav>

      <header className="mb-8">
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
        <p className="mt-1 text-xs text-neutral-600">
          {members.length} linked account{members.length === 1 ? "" : "s"}
        </p>
      </header>

      <section className="mb-8">
        <SectionTitle>Status</SectionTitle>
        <PortalCard>
          <div className="flex flex-wrap gap-2">
            {(["active", "paused", "archived"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={async () => {
                  await updateClient(client.id, { status });
                  await load();
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
        <SectionTitle
          action={
            <span className="font-mono text-[10px] text-neutral-600">
              {projects.length} project{projects.length === 1 ? "" : "s"}
            </span>
          }
        >
          Projects
        </SectionTitle>

        <div className="space-y-2">
          {projects.map((project) => (
            <PortalCard key={project.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {project.url ?? "No URL"}
                  </p>
                  {project.services.length > 0 && (
                    <p className="mt-1 font-mono text-[10px] text-neutral-600">
                      {project.services.map(getServiceName).join(" · ")}
                    </p>
                  )}
                </div>
                <label className="text-xs">
                  <span className="sr-only">Status for {project.name}</span>
                  <select
                    value={project.status}
                    onChange={async (event) => {
                      await setProjectStatus(
                        project.id,
                        event.target.value as ProjectStatus
                      );
                      await load();
                    }}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider outline-none ${statusBadgeClass(project.status)}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status} className="bg-[#111] text-white">
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <UpdateComposer projectId={project.id} onAdded={load} />

              <div className="mt-3 space-y-1.5 border-t border-neutral-900 pt-3">
                {updates
                  .filter((update) => update.project_id === project.id)
                  .map((update) => (
                    <div key={update.id} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={update.done}
                        aria-label={`Mark "${update.body}" done`}
                        onChange={async (event) => {
                          await toggleUpdateDone(update.id, event.target.checked);
                          await load();
                        }}
                        className="mt-0.5 accent-orange-500"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs leading-snug ${
                            update.done
                              ? "text-neutral-600 line-through"
                              : "text-neutral-200"
                          }`}
                        >
                          {update.body}
                        </p>
                        <p className="text-[10px] text-neutral-700">
                          {update.due_date
                            ? `due ${formatDate(update.due_date)}`
                            : formatDate(update.created_at)}
                          {update.acknowledged_at ? " · client acknowledged" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </PortalCard>
          ))}
        </div>

        <div className="mt-3">
          <NewProjectForm clientId={client.id} onCreated={load} />
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>Care plan</SectionTitle>
        <CarePlanForm
          clientId={client.id}
          plan={care?.plan ?? ""}
          active={care?.active ?? false}
          renewsAt={care?.renews_at ?? ""}
          included={care?.included ?? []}
          onSaved={load}
        />
      </section>

      <section>
        <SectionTitle>Thread</SectionTitle>
        <div className="mb-3 space-y-2">
          {messages.length === 0 ? (
            <EmptyState title="No messages" body="Start the conversation below." />
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-lg border px-3 py-2 ${
                  message.from_admin
                    ? "ml-auto border-neutral-700 bg-neutral-900"
                    : "border-neutral-800 bg-[#111]"
                }`}
              >
                <p className="text-sm leading-relaxed text-neutral-200">
                  {message.body}
                </p>
                <p className="mt-1 font-mono text-[10px] text-neutral-600">
                  {message.from_admin ? "You" : client.business_name}
                  {message.service_id
                    ? ` · asked about ${getServiceName(message.service_id)}`
                    : ""}{" "}
                  · {formatDate(message.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
        <MessageComposer clientId={client.id} onSent={load} />
      </section>
    </>
  );
}

function UpdateComposer({
  projectId,
  onAdded,
}: {
  projectId: string;
  onAdded: () => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!body.trim()) return;
        await createUpdate({
          project_id: projectId,
          body: body.trim(),
          due_date: due || undefined,
        });
        setBody("");
        setDue("");
        await onAdded();
      }}
      className="mt-3 flex flex-col gap-2 sm:flex-row"
    >
      <label className="sr-only" htmlFor={`update-${projectId}`}>
        New update item
      </label>
      <input
        id={`update-${projectId}`}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Add an update item…"
        className="flex-1 rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
      />
      <input
        type="date"
        value={due}
        aria-label="Due date"
        onChange={(event) => setDue(event.target.value)}
        className="rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2 text-xs text-neutral-300 outline-none focus:border-neutral-600"
      />
      <button
        type="submit"
        disabled={!body.trim()}
        className="rounded-md border border-neutral-700 px-3 py-2 text-xs text-neutral-200 transition-colors hover:border-neutral-500 disabled:opacity-40"
      >
        Add
      </button>
    </form>
  );
}

function NewProjectForm({
  clientId,
  onCreated,
}: {
  clientId: string;
  onCreated: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-neutral-800 px-3 py-2 text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
      >
        + New project
      </button>
    );
  }

  return (
    <PortalCard>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!name.trim()) return;
          await createProject({
            client_id: clientId,
            name: name.trim(),
            url: url.trim() || undefined,
            services: picked,
          });
          setName("");
          setUrl("");
          setPicked([]);
          setOpen(false);
          await onCreated();
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <AdminField label="Project name" value={name} onChange={setName} required />
        <AdminField
          label="URL"
          value={url}
          onChange={setUrl}
          placeholder="https://"
        />

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-xs text-neutral-500">Services</legend>
          <div className="flex flex-wrap gap-1.5">
            {services.map((service) => {
              const active = picked.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setPicked((current) =>
                      active
                        ? current.filter((id) => id !== service.id)
                        : [...current, service.id]
                    )
                  }
                  className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                    active
                      ? "border-orange-500/60 bg-orange-500/10 text-orange-300"
                      : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {service.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            Create project
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </PortalCard>
  );
}

function CarePlanForm({
  clientId,
  plan,
  active,
  renewsAt,
  included,
  onSaved,
}: {
  clientId: string;
  plan: string;
  active: boolean;
  renewsAt: string;
  included: string[];
  onSaved: () => Promise<void>;
}) {
  const [planName, setPlanName] = useState(plan);
  const [isActive, setIsActive] = useState(active);
  const [renews, setRenews] = useState(renewsAt);
  const [items, setItems] = useState(included.join(", "));
  const [saved, setSaved] = useState(false);

  return (
    <PortalCard>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!planName.trim()) return;
          await upsertCarePlan({
            client_id: clientId,
            plan: planName.trim(),
            active: isActive,
            renews_at: renews || null,
            included: items
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          });
          setSaved(true);
          await onSaved();
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <AdminField
          label="Plan"
          value={planName}
          onChange={setPlanName}
          placeholder="Maintenance"
        />
        <label className="text-xs text-neutral-500">
          Renews
          <input
            type="date"
            value={renews}
            onChange={(event) => setRenews(event.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-600"
          />
        </label>
        <AdminField
          label="Included (comma separated)"
          value={items}
          onChange={setItems}
          placeholder="Updates, backups, uptime checks"
        />
        <label className="flex items-end gap-2 text-xs text-neutral-500">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="accent-orange-500"
          />
          Active
        </label>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={!planName.trim()}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            Save care plan
          </button>
          {saved && <span className="text-xs text-green-400">Saved.</span>}
        </div>
      </form>
    </PortalCard>
  );
}

function MessageComposer({
  clientId,
  onSent,
}: {
  clientId: string;
  onSent: () => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!body.trim()) return;
          setBusy(true);
          setResult(null);
          try {
            const { emailed } = await sendAdminMessage(clientId, body.trim());
            setBody("");
            setResult(
              emailed
                ? "Sent and emailed."
                : "Posted to the thread. Email is not configured, so no notification was sent."
            );
            await onSent();
          } catch {
            setResult("Could not send.");
          } finally {
            setBusy(false);
          }
        }}
        className="flex gap-2"
      >
        <label className="sr-only" htmlFor="admin-message">
          Message
        </label>
        <input
          id="admin-message"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Message this client…"
          maxLength={5000}
          className="flex-1 rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
        >
          Send
        </button>
      </form>
      {result && (
        <p className="mt-2 text-xs text-neutral-500">{result}</p>
      )}
    </>
  );
}
