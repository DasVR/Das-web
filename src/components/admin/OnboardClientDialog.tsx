"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/app/admin/clients/AdminClients";
import { PortalCard, PortalNotice } from "@/components/portal/PortalShell";
import {
  convertLead,
  createClient,
  createProject,
  createUpdate,
  generateAccessKey,
  notifyNewClient,
} from "@/lib/admin";
import { supportedIndustries } from "@/lib/dashboard";
import type { ClientRow } from "@/lib/database.types";
import {
  getProjectTemplate,
  projectTemplates,
  type ProjectTemplateId,
} from "@/lib/projectTemplates";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

export type OnboardPrefill = {
  leadId?: string;
  businessName?: string;
  contactName?: string;
  email?: string;
};

type Step = "business" | "project" | "done";

/**
 * One flow for every "make a new client" entry point (Inbox row actions,
 * Clients "+ New client"). Replaces four near-duplicate paths that used to
 * exist across the old Overview / Leads / Clients pages, and is the single
 * place that fixes the leads.client_id gap: converting a lead now always
 * goes through here.
 */
export function OnboardClientDialog({
  open,
  onClose,
  onDone,
  prefill,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void | Promise<void>;
  prefill?: OnboardPrefill;
}) {
  const [step, setStep] = useState<Step>("business");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");

  const [wantsProject, setWantsProject] = useState(true);
  const [templateId, setTemplateId] = useState<ProjectTemplateId>("website-build");
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [picked, setPicked] = useState<string[]>(
    getProjectTemplate("website-build").services
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ client: ClientRow; key: string } | null>(
    null
  );

  useEffect(() => {
    if (!open) return;
    setStep("business");
    setBusinessName(prefill?.businessName ?? "");
    setContactName(prefill?.contactName ?? prefill?.businessName ?? "");
    setEmail(prefill?.email ?? "");
    setPhone("");
    setIndustry("");
    setWantsProject(true);
    setTemplateId("website-build");
    setProjectName("");
    setProjectUrl("");
    setPicked(getProjectTemplate("website-build").services);
    setError(null);
    setResult(null);
  }, [open, prefill]);

  if (!open) return null;

  function applyTemplate(id: ProjectTemplateId) {
    setTemplateId(id);
    setPicked(getProjectTemplate(id).services);
  }

  async function handleCreate() {
    if (!businessName.trim()) {
      setError("Business name is required.");
      setStep("business");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const key = generateAccessKey();
      const client = await createClient({
        business_name: businessName.trim(),
        contact_name: contactName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        industry: industry || undefined,
        access_key: key,
      });

      if (prefill?.leadId) {
        await convertLead(prefill.leadId, client.id);
      }

      if (wantsProject && projectName.trim()) {
        const template = getProjectTemplate(templateId);
        const projectId = await createProject({
          client_id: client.id,
          name: projectName.trim(),
          url: projectUrl.trim() || undefined,
          services: picked,
        });
        for (const item of template.checklist) {
          await createUpdate({ project_id: projectId, body: item });
        }
      }

      await notifyNewClient(client, key);
      setResult({ client, key });
      setStep("done");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not create the client."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleFinish() {
    await onDone();
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Onboard a new client"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget && step !== "done") onClose();
      }}
    >
      <div className="w-full max-w-lg">
        <PortalCard className="bg-[#111]">
          {step !== "done" && (
            <div className="mb-5 flex items-center gap-2">
              {(["business", "project"] as const).map((s, index) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-medium",
                      step === s
                        ? "bg-white text-black"
                        : "bg-neutral-800 text-neutral-500"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      step === s ? "text-white" : "text-neutral-600"
                    )}
                  >
                    {s === "business" ? "Business info" : "First project"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4">
              <PortalNotice tone="error">{error}</PortalNotice>
            </div>
          )}

          {step === "business" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!businessName.trim()) {
                  setError("Business name is required.");
                  return;
                }
                setError(null);
                setStep("project");
              }}
              className="space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField
                  label="Business name"
                  value={businessName}
                  onChange={setBusinessName}
                  required
                />
                <AdminField
                  label="Contact name"
                  value={contactName}
                  onChange={setContactName}
                />
                <AdminField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <AdminField label="Phone" value={phone} onChange={setPhone} />
              </div>
              <label className="block text-xs text-neutral-500">
                Industry
                <select
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-[#0e0e0e] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-600"
                >
                  <option value="">Not set</option>
                  {supportedIndustries.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!businessName.trim()}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
                >
                  Next: first project
                </button>
              </div>
            </form>
          )}

          {step === "project" && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={wantsProject}
                  onChange={(event) => setWantsProject(event.target.checked)}
                  className="accent-orange-500"
                />
                Start a project now
              </label>

              {wantsProject && (
                <>
                  <fieldset>
                    <legend className="mb-2 text-xs text-neutral-500">
                      Template
                    </legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {projectTemplates.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => {
                            applyTemplate(template.id);
                            if (!projectName.trim() && template.id !== "custom") {
                              setProjectName(`${businessName.trim()} — ${template.label}`);
                            }
                          }}
                          className={cn(
                            "rounded-md border px-3 py-2 text-left text-xs transition-colors",
                            templateId === template.id
                              ? "border-orange-500/60 bg-orange-500/10 text-orange-200"
                              : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                          )}
                        >
                          <p className="font-medium">{template.label}</p>
                          <p className="mt-0.5 text-neutral-500">
                            {template.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminField
                      label="Project name"
                      value={projectName}
                      onChange={setProjectName}
                      required
                    />
                    <AdminField
                      label="URL"
                      value={projectUrl}
                      onChange={setProjectUrl}
                      placeholder="https://"
                    />
                  </div>

                  <fieldset>
                    <legend className="mb-2 text-xs text-neutral-500">
                      Services
                    </legend>
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
                    <p className="text-[11px] text-neutral-600">
                      Checklist added automatically:{" "}
                      {getProjectTemplate(templateId).checklist.join(" · ")}
                    </p>
                  )}
                </>
              )}

              <div className="flex justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep("business")}
                  className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={busy || (wantsProject && !projectName.trim())}
                  onClick={handleCreate}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
                >
                  {busy ? "Creating…" : "Create client"}
                </button>
              </div>
            </div>
          )}

          {step === "done" && result && (
            <div className="space-y-4">
              <PortalNotice tone="success">
                {result.client.business_name} is ready.
              </PortalNotice>
              <div>
                <p className="text-xs text-neutral-500">Access key</p>
                <p className="mt-1 font-mono text-2xl tracking-widest text-orange-400">
                  {result.key}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  Share this with{" "}
                  {result.client.contact_name || result.client.business_name}.
                  They enter it at dasdev.net/dashboard/login to activate their
                  workspace.
                </p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(result.key)}
                  className="mt-2 text-xs text-neutral-400 transition-colors hover:text-neutral-200"
                >
                  Copy key
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </PortalCard>
      </div>
    </div>
  );
}
