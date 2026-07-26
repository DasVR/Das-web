"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminGate } from "@/components/portal/AdminGate";
import {
  EmptyState,
  PortalCard,
  PortalNotice,
} from "@/components/portal/PortalShell";
import {
  fetchAllClients,
  fetchAllProjects,
  setProjectStatus,
} from "@/lib/admin";
import { statusBadgeClass } from "@/lib/dashboard";
import type { ClientRow, ProjectRow, ProjectStatus } from "@/lib/database.types";
import { getServiceName } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase";

const columns: ProjectStatus[] = ["queued", "in progress", "in review", "live"];

export function AdminProjects() {
  return (
    <AdminGate>
      <ProjectsBody />
    </AdminGate>
  );
}

function ProjectsBody() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [nextProjects, nextClients] = await Promise.all([
        fetchAllProjects(),
        fetchAllClients(),
      ]);
      setProjects(nextProjects);
      setClients(nextClients);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load projects.");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void load();
  }, [load]);

  const byStatus = useMemo(() => {
    const grouped: Record<ProjectStatus, ProjectRow[]> = {
      queued: [],
      "in progress": [],
      "in review": [],
      live: [],
    };
    for (const project of projects) grouped[project.status].push(project);
    return grouped;
  }, [projects]);

  const clientName = (id: string) =>
    clients.find((client) => client.id === id)?.business_name ?? "Unassigned";

  return (
    <>
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          {projects.length} across {clients.length} client
          {clients.length === 1 ? "" : "s"}
        </p>
        <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
          Projects
        </h1>
      </header>

      {error && (
        <div className="mb-4">
          <PortalNotice tone="error">{error}</PortalNotice>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          body={
            <>
              Create one from a{" "}
              <Link href="/admin/clients" className="underline">
                client record
              </Link>
              .
            </>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {columns.map((status) => (
            <section key={status}>
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadgeClass(status)}`}
                >
                  {status}
                </span>
                <span className="font-mono text-[10px] text-neutral-600">
                  {byStatus[status].length}
                </span>
              </div>

              <div className="space-y-2">
                {byStatus[status].map((project) => (
                  <PortalCard key={project.id} className="px-3 py-3">
                    <Link
                      href={`/admin/clients/detail?id=${project.client_id}`}
                      className="block"
                    >
                      <p className="truncate text-sm font-medium hover:text-white">
                        {project.name}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {clientName(project.client_id)}
                      </p>
                    </Link>

                    {project.services.length > 0 && (
                      <p className="mt-1.5 truncate font-mono text-[10px] text-neutral-600">
                        {project.services.map(getServiceName).join(" · ")}
                      </p>
                    )}

                    <label className="mt-2 block">
                      <span className="sr-only">Move {project.name}</span>
                      <select
                        value={project.status}
                        onChange={async (event) => {
                          await setProjectStatus(
                            project.id,
                            event.target.value as ProjectStatus
                          );
                          await load();
                        }}
                        className="w-full rounded border border-neutral-800 bg-[#0e0e0e] px-2 py-1 text-[10px] text-neutral-400 outline-none focus:border-neutral-600"
                      >
                        {columns.map((option) => (
                          <option key={option} value={option}>
                            move to {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </PortalCard>
                ))}

                {byStatus[status].length === 0 && (
                  <p className="rounded-lg border border-dashed border-neutral-900 px-3 py-6 text-center text-[11px] text-neutral-700">
                    Nothing here
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
