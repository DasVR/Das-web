"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminField } from "@/app/admin/clients/AdminClients";
import { EmptyState, PortalCard, PortalNotice, SectionTitle } from "@/components/portal/PortalShell";
import {
  createUpdate,
  fetchProjectFiles,
  fetchProjectUpdates,
  setProjectStatus,
  toggleUpdateDone,
  updateProject,
} from "@/lib/admin";
import { formatBytes, formatDate, statusBadgeClass } from "@/lib/dashboard";
import type { FileRow, ProjectRow, ProjectStatus, ReviewFeedbackRow } from "@/lib/database.types";
import {
  createReviewLink,
  deactivateReviewLink,
  defaultExpiryDays,
  fetchProjectReviewFeedback,
  fetchProjectReviews,
  setReviewFeedbackStatus,
} from "@/lib/reviews";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

const statuses: ProjectStatus[] = ["queued", "in progress", "in review", "live"];

type PanelData = {
  updates: import("@/lib/database.types").UpdateRow[];
  reviews: import("@/lib/database.types").ProjectReviewRow[];
  feedback: ReviewFeedbackRow[];
  files: FileRow[];
};

/**
 * The place an admin enters full project spec detail — clicking a card on
 * the Kanban board opens this instead of only linking back to the client.
 * Everything a client can see about a project (services, checklist, review
 * link, files) is edited here.
 */
export function ProjectDetailPanel({
  project,
  clientName,
  onClose,
  onChanged,
}: {
  project: ProjectRow;
  clientName: string;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [data, setData] = useState<PanelData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [updates, reviews, feedback, files] = await Promise.all([
        fetchProjectUpdates(project.id),
        fetchProjectReviews(project.id),
        fetchProjectReviewFeedback(project.id),
        fetchProjectFiles(project.id),
      ]);
      setData({ updates, reviews, feedback, files });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load project.");
    }
  }, [project.id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl">
        <PortalCard className="bg-[#111]">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-neutral-500">{clientName}</p>
              <h2 className="mt-0.5 truncate font-display text-lg font-medium">
                {project.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 rounded-md border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-400 hover:border-neutral-600"
            >
              Close
            </button>
          </div>

          {error && (
            <div className="mb-4">
              <PortalNotice tone="error">{error}</PortalNotice>
            </div>
          )}

          <SpecForm
            project={project}
            onSaved={async () => {
              await onChanged();
            }}
          />

          <section className="mt-6">
            <SectionTitle>Checklist</SectionTitle>
            {!data ? (
              <p className="text-xs text-neutral-500">Loading…</p>
            ) : (
              <>
                <div className="mb-3 space-y-1.5">
                  {data.updates.length === 0 ? (
                    <p className="text-xs text-neutral-600">No items yet.</p>
                  ) : (
                    data.updates.map((update) => (
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
                              update.done ? "text-neutral-600 line-through" : "text-neutral-200"
                            }`}
                          >
                            {update.body}
                          </p>
                          <p className="text-[10px] text-neutral-700">
                            {update.due_date ? `due ${formatDate(update.due_date)}` : formatDate(update.created_at)}
                            {update.acknowledged_at ? " · client acknowledged" : ""}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <ChecklistComposer
                  projectId={project.id}
                  onAdded={async () => {
                    await load();
                    await onChanged();
                  }}
                />
              </>
            )}
          </section>

          <section className="mt-6">
            <SectionTitle>Review links</SectionTitle>
            {!data ? (
              <p className="text-xs text-neutral-500">Loading…</p>
            ) : (
              <ReviewLinks
                projectId={project.id}
                projectUrl={project.url}
                reviews={data.reviews}
                onChanged={load}
              />
            )}
          </section>

          <section className="mt-6">
            <SectionTitle
              action={
                data && data.feedback.length > 0 ? (
                  <span className="font-mono text-[10px] text-neutral-600">
                    {data.feedback.filter((f) => f.status === "open").length} open
                  </span>
                ) : undefined
              }
            >
              Review feedback
            </SectionTitle>
            {!data ? (
              <p className="text-xs text-neutral-500">Loading…</p>
            ) : data.feedback.length === 0 ? (
              <EmptyState
                title="No feedback yet"
                body="Notes left on a review link show up here for triage."
              />
            ) : (
              <div className="space-y-2">
                {data.feedback.map((item) => (
                  <PortalCard key={item.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm leading-relaxed text-neutral-200">{item.body}</p>
                        <p className="mt-1 font-mono text-[10px] text-neutral-600">
                          {item.author_name || "Anonymous"} · {formatDate(item.created_at)}
                        </p>
                      </div>
                      <select
                        value={item.status}
                        onChange={async (event) => {
                          await setReviewFeedbackStatus(
                            item.id,
                            event.target.value as ReviewFeedbackRow["status"]
                          );
                          await load();
                        }}
                        className={cn(
                          "flex-shrink-0 rounded-md border-none px-2 py-1 text-[10px] font-medium uppercase tracking-wider outline-none",
                          item.status === "open"
                            ? "bg-amber-500/10 text-amber-400"
                            : item.status === "resolved"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-neutral-800 text-neutral-500"
                        )}
                      >
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                        <option value="wontfix">Won&apos;t fix</option>
                      </select>
                    </div>
                  </PortalCard>
                ))}
              </div>
            )}
          </section>

          <section className="mt-6">
            <SectionTitle>Files</SectionTitle>
            {!data ? (
              <p className="text-xs text-neutral-500">Loading…</p>
            ) : data.files.length === 0 ? (
              <EmptyState title="No files yet" body="Deliverables scoped to this project appear here." />
            ) : (
              <div className="space-y-2">
                {data.files.map((file) => (
                  <PortalCard key={file.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm">{file.label}</p>
                      <p className="text-[11px] text-neutral-600">
                        {formatBytes(file.size_bytes)} · {formatDate(file.created_at)}
                      </p>
                    </div>
                  </PortalCard>
                ))}
              </div>
            )}
          </section>

          <div className="mt-6 border-t border-neutral-900 pt-4">
            <Link
              href={`/admin/clients/detail?id=${project.client_id}`}
              className="text-xs text-neutral-500 underline transition-colors hover:text-neutral-300"
            >
              Open {clientName}&apos;s client page →
            </Link>
          </div>
        </PortalCard>
      </div>
    </div>
  );
}

function SpecForm({
  project,
  onSaved,
}: {
  project: ProjectRow;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(project.name);
  const [url, setUrl] = useState(project.url ?? "");
  const [note, setNote] = useState(project.note ?? "");
  const [picked, setPicked] = useState<string[]>(project.services);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!name.trim()) return;
        setBusy(true);
        try {
          await updateProject(project.id, {
            name: name.trim(),
            url: url.trim() || null,
            note: note.trim() || null,
            services: picked,
          });
          setSaved(true);
          await onSaved();
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs">
          <span className="sr-only">Status</span>
          <select
            value={project.status}
            onChange={async (event) => {
              await setProjectStatus(project.id, event.target.value as ProjectStatus);
              await onSaved();
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

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField
          label="Project name"
          value={name}
          onChange={(v) => {
            setName(v);
            setSaved(false);
          }}
          required
        />
        <AdminField
          label="URL"
          value={url}
          onChange={(v) => {
            setUrl(v);
            setSaved(false);
          }}
          placeholder="https://"
        />
      </div>

      <label className="block text-xs text-neutral-500">
        Note
        <textarea
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setSaved(false);
          }}
          rows={2}
          placeholder="Anything the client should see alongside this project…"
          className="mt-1 w-full resize-y rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
        />
      </label>

      <fieldset>
        <legend className="mb-2 text-xs text-neutral-500">Services</legend>
        <div className="flex flex-wrap gap-1.5">
          {services.map((service) => {
            const active = picked.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setPicked((current) =>
                    active ? current.filter((id) => id !== service.id) : [...current, service.id]
                  );
                  setSaved(false);
                }}
                className={cn(
                  "rounded border px-2 py-1 text-[10px] transition-colors",
                  active
                    ? "border-orange-500/60 bg-orange-500/10 text-orange-300"
                    : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
                )}
              >
                {service.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save spec"}
        </button>
        {saved && <span className="text-xs text-green-400">Saved.</span>}
      </div>
    </form>
  );
}

function ChecklistComposer({
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
        await createUpdate({ project_id: projectId, body: body.trim(), due_date: due || undefined });
        setBody("");
        setDue("");
        await onAdded();
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <label className="sr-only" htmlFor={`panel-update-${projectId}`}>
        New checklist item
      </label>
      <input
        id={`panel-update-${projectId}`}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Add a checklist item…"
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

function ReviewLinks({
  projectId,
  projectUrl,
  reviews,
  onChanged,
}: {
  projectId: string;
  projectUrl: string | null;
  reviews: import("@/lib/database.types").ProjectReviewRow[];
  onChanged: () => Promise<void>;
}) {
  const [creating, setCreating] = useState(false);
  const [reviewUrl, setReviewUrl] = useState(projectUrl ?? "");
  const [days, setDays] = useState(7);

  return (
    <div className="space-y-2">
      {reviews.map((review) => {
        const expired = new Date(review.expires_at) < new Date();
        const link = `${typeof window !== "undefined" ? window.location.origin : "https://dasdev.net"}/review?token=${review.token}`;
        return (
          <div
            key={review.id}
            className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-[11px] ${
              review.active && !expired
                ? "border-green-800 bg-green-500/10"
                : "border-neutral-800 bg-[#0e0e0e] opacity-60"
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
                    await onChanged();
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

      {creating ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await createReviewLink({
              project_id: projectId,
              external_url: reviewUrl.trim() || undefined,
              expires_at: defaultExpiryDays(days),
            });
            setCreating(false);
            await onChanged();
          }}
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
        >
          <AdminField
            label="Preview URL (optional)"
            value={reviewUrl}
            onChange={setReviewUrl}
            placeholder="https://staging… or Figma / Drive link"
          />
          <label className="text-xs text-neutral-500">
            Expires in
            <select
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            >
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-white px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-md border border-neutral-800 px-3 py-2 text-xs text-neutral-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md border border-neutral-800 px-3 py-2 text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
        >
          + New review link
        </button>
      )}
    </div>
  );
}
