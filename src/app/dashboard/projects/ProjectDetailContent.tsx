"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
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
import {
  acknowledgeUpdate,
  fetchWorkspace,
  formatBytes,
  formatDate,
  signedFileUrl,
  type ClientWorkspace,
} from "@/lib/dashboard";
import { getService } from "@/lib/services";

const navLinks = [{ href: "/dashboard", label: "Workspace" }];

export function ProjectDetailContent() {
  const { allowed, loading } = useRequireAuth();

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
      {/* useSearchParams needs a boundary in a statically exported page. */}
      <Suspense fallback={<p className="text-sm text-neutral-500">Loading project…</p>}>
        <ProjectBody />
      </Suspense>
    </PortalShell>
  );
}

function ProjectBody() {
  const projectId = useSearchParams().get("id");
  const [workspace, setWorkspace] = useState<ClientWorkspace | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setWorkspace(await fetchWorkspace());
      setState("ready");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load your workspace.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (state === "loading") {
    return <p className="text-sm text-neutral-500">Loading project…</p>;
  }

  if (state === "error") {
    return <PortalNotice tone="error">{error}</PortalNotice>;
  }

  const project = workspace?.projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        body={
          <>
            Pick one from{" "}
            <Link href="/dashboard" className="underline">
              your workspace
            </Link>
            .
          </>
        }
      />
    );
  }

  const files = (workspace?.files ?? []).filter((file) => file.project_id === project.id);
  const activeReview = project.reviews[0] ?? null;
  const openUpdates = project.updates.filter((update) => !update.done);
  const doneUpdates = project.updates.filter((update) => update.done);

  return (
    <>
      <Link
        href="/dashboard"
        className="mb-4 inline-block text-xs text-neutral-500 transition-colors hover:text-neutral-300"
      >
        ← Your workspace
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-xl font-medium tracking-tight sm:text-2xl">
            {project.name}
          </h1>
          <StatusBadge status={project.status} audience="client" />
        </div>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-neutral-500 hover:text-neutral-300"
          >
            {project.url}
          </a>
        ) : (
          <p className="mt-1 text-sm text-neutral-600">URL pending</p>
        )}
        {project.note && <p className="mt-2 text-sm text-neutral-400">{project.note}</p>}
      </header>

      {activeReview && (
        <section className="mb-8">
          <SectionTitle>Preview & review</SectionTitle>
          <PortalCard className="border-green-900/40 bg-green-500/5">
            <p className="text-sm text-neutral-200">
              A preview is ready for your feedback.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Expires {new Date(activeReview.expires_at).toLocaleDateString("en-US")}
            </p>
            <Link
              href={`/review?token=${activeReview.token}`}
              className="mt-3 inline-block rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Open review page
            </Link>
          </PortalCard>
        </section>
      )}

      <section className="mb-8">
        <SectionTitle>Services included</SectionTitle>
        {project.services.length === 0 ? (
          <EmptyState title="No services listed" body="Ask us to add scope here." />
        ) : (
          <div className="space-y-2">
            {project.services.map((serviceId) => {
              const service = getService(serviceId);
              return (
                <PortalCard key={serviceId} className="px-4 py-3">
                  <p className="text-sm font-medium">{service?.name ?? serviceId}</p>
                  {service && (
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                      {service.detail}
                    </p>
                  )}
                </PortalCard>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle
          action={
            <span className="font-mono text-[10px] text-neutral-600">
              {openUpdates.length} open
            </span>
          }
        >
          Updates
        </SectionTitle>
        {project.updates.length === 0 ? (
          <EmptyState title="No updates yet" body="Progress notes will show up here." />
        ) : (
          <div className="space-y-2">
            {[...openUpdates, ...doneUpdates].map((update) => (
              <PortalCard key={update.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border ${
                      update.done ? "border-green-500 bg-green-500" : "border-neutral-600"
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
                      {update.due_date ? `Due ${formatDate(update.due_date)}` : formatDate(update.created_at)}
                      {update.acknowledged_at ? " · acknowledged" : ""}
                    </p>
                  </div>
                  {!update.done && !update.acknowledged_at && (
                    <button
                      type="button"
                      onClick={async () => {
                        await acknowledgeUpdate(update.id);
                        await load();
                      }}
                      className="flex-shrink-0 rounded border border-neutral-700 px-2 py-1 text-[11px] text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
                    >
                      Got it
                    </button>
                  )}
                </div>
              </PortalCard>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle>Files</SectionTitle>
        {files.length === 0 ? (
          <EmptyState title="No files yet" body="Deliverables for this project will appear here." />
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <PortalCard key={file.id} className="flex items-center justify-between gap-3 px-4 py-3">
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
              </PortalCard>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
