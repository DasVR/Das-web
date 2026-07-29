"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminField } from "@/app/admin/clients/AdminClients";
import { EmptyState, PortalCard, SectionTitle } from "@/components/portal/PortalShell";
import { createProject, createUpdate, setProjectStatus, toggleUpdateDone } from "@/lib/admin";
import { formatDate, statusBadgeClass } from "@/lib/dashboard";
import type { ProjectRow, ProjectStatus, UpdateRow } from "@/lib/database.types";
import { getProjectTemplate, projectTemplates, type ProjectTemplateId } from "@/lib/projectTemplates";
import { getServiceName, services } from "@/lib/services";
import { cn } from "@/lib/utils";

const statuses: ProjectStatus[] = ["queued", "in progress", "in review", "live"];

export function ClientHubProjectsTab({
  clientId,
  clientName,
  projects,
  updates,
  onChanged,
}: {
  clientId: string;
  clientName: string;
  projects: ProjectRow[];
  updates: UpdateRow[];
  onChanged: () => Promise<void>;
}) {
  return (
    <>
      <SectionTitle
        action={
          <span className="font-mono text-[10px] text-neutral-600">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </span>
        }
      >
        Projects
      </SectionTitle>

      {projects.length === 0 ? (
        <div className="mb-4">
          <EmptyState title="No projects yet" body="Start the first one below." />
        </div>
      ) : (
        <div className="mb-4 space-y-2">
          {projects.map((project) => (
            <PortalCard key={project.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/admin/projects?id=${project.id}`}
                    className="truncate text-sm font-medium hover:text-neutral-300"
                  >
                    {project.name}
                  </Link>
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
                      await setProjectStatus(project.id, event.target.value as ProjectStatus);
                      await onChanged();
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

              <UpdateComposer projectId={project.id} onAdded={onChanged} />

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
                          await onChanged();
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
                  ))}
              </div>

              <Link
                href={`/admin/projects?id=${project.id}`}
                className="mt-3 inline-block text-[11px] text-neutral-500 underline transition-colors hover:text-neutral-300"
              >
                Full spec, reviews & files →
              </Link>
            </PortalCard>
          ))}
        </div>
      )}

      <NewProjectForm clientId={clientId} clientName={clientName} onCreated={onChanged} />
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
        await createUpdate({ project_id: projectId, body: body.trim(), due_date: due || undefined });
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
  clientName,
  onCreated,
}: {
  clientId: string;
  clientName: string;
  onCreated: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState<ProjectTemplateId>("website-build");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [picked, setPicked] = useState<string[]>(getProjectTemplate("website-build").services);
  const [busy, setBusy] = useState(false);

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

  function applyTemplate(id: ProjectTemplateId) {
    setTemplateId(id);
    setPicked(getProjectTemplate(id).services);
    if (!name.trim() && id !== "custom") {
      setName(`${clientName} — ${getProjectTemplate(id).label}`);
    }
  }

  return (
    <PortalCard>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!name.trim()) return;
          setBusy(true);
          try {
            const projectId = await createProject({
              client_id: clientId,
              name: name.trim(),
              url: url.trim() || undefined,
              services: picked,
            });
            for (const item of getProjectTemplate(templateId).checklist) {
              await createUpdate({ project_id: projectId, body: item });
            }
            setOpen(false);
            setName("");
            setUrl("");
            await onCreated();
          } finally {
            setBusy(false);
          }
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-xs text-neutral-500">Template</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {projectTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-left text-xs transition-colors",
                  templateId === template.id
                    ? "border-orange-500/60 bg-orange-500/10 text-orange-200"
                    : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                )}
              >
                <p className="font-medium">{template.label}</p>
                <p className="mt-0.5 text-neutral-500">{template.description}</p>
              </button>
            ))}
          </div>
        </fieldset>

        <AdminField label="Project name" value={name} onChange={setName} required />
        <AdminField label="URL" value={url} onChange={setUrl} placeholder="https://" />

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
                      active ? current.filter((id) => id !== service.id) : [...current, service.id]
                    )
                  }
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

        {getProjectTemplate(templateId).checklist.length > 0 && (
          <p className="text-[11px] text-neutral-600 sm:col-span-2">
            Checklist added automatically: {getProjectTemplate(templateId).checklist.join(" · ")}
          </p>
        )}

        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create project"}
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
