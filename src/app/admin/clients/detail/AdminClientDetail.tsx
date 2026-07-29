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
  deleteClient,
  fetchClientDetail,
  generateAccessKey,
  markClientMessagesRead,
  sendAdminMessage,
  setClientAccessKey,
  setProjectStatus,
  toggleAdmin,
  toggleUpdateDone,
  updateClient,
  upsertCarePlan,
  type AdminClientDetail as Detail,
} from "@/lib/admin";
import { formatDate, statusBadgeClass } from "@/lib/dashboard";
import type { ProjectStatus } from "@/lib/database.types";
import { fetchProjectReviews, deactivateReviewLink } from "@/lib/reviews";
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
            <button
              type="button"
              onClick={async () => {
                const key = generateAccessKey();
                await setClientAccessKey(client.id, key);
                await load();
              }}
              className="rounded-md border border-neutral-800 px-3 py-1.5 text-[10px] text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
            >
              Regenerate key
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
                onClick={() => {
                  navigator.clipboard.writeText(client.access_key ?? "");
                }}
                className="text-[10px] text-neutral-400 transition-colors hover:text-neutral-200"
              >
                Copy key
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-neutral-500">
                No active key. Generate one so{" "}
                {client.contact_name || "the client"} can activate their
                workspace.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const key = generateAccessKey();
                  await setClientAccessKey(client.id, key);
                  await load();
                }}
                className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
              >
                Generate key
              </button>
            </div>
          )}
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

              <ProjectReviews projectId={project.id} />

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

      <section className="mb-8">
        <SectionTitle>Linked accounts</SectionTitle>
        {members.length === 0 ? (
          <EmptyState
            title="No linked accounts"
            body="The client has not activated their workspace yet."
          />
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <PortalCard key={member.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.full_name || "Unnamed"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {member.role} · {member.id.slice(0, 8)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const makeAdmin = member.role !== "admin";
                      await toggleAdmin(member.id, makeAdmin);
                      await load();
                    }}
                    className={`rounded-md px-3 py-1.5 text-[10px] font-medium transition-colors ${
                      member.role === "admin"
                        ? "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30"
                        : "border border-neutral-800 text-neutral-400 hover:border-neutral-600"
                    }`}
                  >
                    {member.role === "admin" ? "Revoke admin" : "Make admin"}
                  </button>
                </div>
              </PortalCard>
            ))}
          </div>
        )}
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
  const [enableReview, setEnableReview] = useState(true);
  const [reviewUrl, setReviewUrl] = useState("");
  const [reviewDays, setReviewDays] = useState(7);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

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
          const projectId = await createProject({
            client_id: clientId,
            name: name.trim(),
            url: url.trim() || undefined,
            services: picked,
          });
          if (enableReview) {
            const { createReviewLink } = await import("@/lib/reviews");
            const review = await createReviewLink({
              project_id: projectId,
              external_url: reviewUrl.trim() || url.trim() || undefined,
              expires_at: new Date(
                Date.now() + reviewDays * 24 * 60 * 60 * 1000
              ).toISOString(),
            });
            const link = `${typeof window !== "undefined" ? window.location.origin : "https://dasdev.net"}/review?token=${review.token}`;
            setCreatedLink(link);
          }
          setName("");
          setUrl("");
          setPicked([]);
          setReviewUrl("");
          setReviewDays(7);
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

        <label className="flex items-center gap-2 text-xs text-neutral-500 sm:col-span-2">
          <input
            type="checkbox"
            checked={enableReview}
            onChange={(e) => setEnableReview(e.target.checked)}
            className="accent-orange-500"
          />
          Enable client review link
        </label>

        {enableReview && (
          <>
            <AdminField
              label="Review URL (optional)"
              value={reviewUrl}
              onChange={setReviewUrl}
              placeholder="https://staging… or Figma / Drive link"
            />
            <label className="text-xs text-neutral-500">
              Expires in
              <select
                value={reviewDays}
                onChange={(e) => setReviewDays(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
              >
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </label>
          </>
        )}

        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            Create project
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setCreatedLink(null);
            }}
            className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-400"
          >
            Cancel
          </button>
        </div>

        {createdLink && (
          <div className="sm:col-span-2 rounded-md border border-green-800 bg-green-500/10 p-3">
            <p className="text-xs text-green-400">Review link created</p>
            <p className="mt-1 break-all font-mono text-[11px] text-neutral-300">
              {createdLink}
            </p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(createdLink)}
              className="mt-2 text-[10px] text-neutral-400 transition-colors hover:text-neutral-200"
            >
              Copy link
            </button>
          </div>
        )}
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

function ProjectReviews({ projectId }: { projectId: string }) {
  const [reviews, setReviews] = useState<import("@/lib/database.types").ProjectReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchProjectReviews(projectId);
      setReviews(data);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {reviews.map((review) => {
        const expired = new Date(review.expires_at) < new Date();
        const link = `${typeof window !== "undefined" ? window.location.origin : "https://dasdev.net"}/review?token=${review.token}`;
        return (
          <div
            key={review.id}
            className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-[11px] ${
              review.active && !expired
                ? "border-green-800 bg-green-500/10"
                : "border-neutral-800 bg-[#111] opacity-60"
            }`}
          >
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] text-neutral-400">
                {review.active && !expired ? "Active" : "Inactive"}
                {" · expires "}
                {new Date(review.expires_at).toLocaleDateString("en-US")}
              </p>
              <p className="mt-0.5 break-all text-neutral-300">{link}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(link)}
                className="text-[10px] text-neutral-400 transition-colors hover:text-neutral-200"
              >
                Copy
              </button>
              {review.active && !expired && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Deactivate this review link?")) return;
                    await deactivateReviewLink(review.id);
                    await load();
                  }}
                  className="text-[10px] text-red-400 transition-colors hover:text-red-300"
                >
                  Deactivate
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
