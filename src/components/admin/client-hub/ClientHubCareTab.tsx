"use client";

import { useState } from "react";
import { PortalCard, SectionTitle } from "@/components/portal/PortalShell";
import { upsertCarePlan } from "@/lib/admin";
import type { CarePlanRow } from "@/lib/database.types";

export function ClientHubCareTab({
  clientId,
  care,
  onChanged,
}: {
  clientId: string;
  care: CarePlanRow | null;
  onChanged: () => Promise<void>;
}) {
  const [planName, setPlanName] = useState(care?.plan ?? "");
  const [isActive, setIsActive] = useState(care?.active ?? false);
  const [renews, setRenews] = useState(care?.renews_at ?? "");
  const [items, setItems] = useState((care?.included ?? []).join(", "));
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <SectionTitle>Care & billing</SectionTitle>
      <PortalCard>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!planName.trim()) return;
            setBusy(true);
            try {
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
              await onChanged();
            } finally {
              setBusy(false);
            }
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <label className="text-xs text-neutral-500">
            Plan
            <input
              value={planName}
              onChange={(event) => {
                setPlanName(event.target.value);
                setSaved(false);
              }}
              placeholder="Maintenance"
              className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Renews
            <input
              type="date"
              value={renews}
              onChange={(event) => {
                setRenews(event.target.value);
                setSaved(false);
              }}
              className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-600"
            />
          </label>
          <label className="text-xs text-neutral-500 sm:col-span-2">
            Included (comma separated)
            <input
              value={items}
              onChange={(event) => {
                setItems(event.target.value);
                setSaved(false);
              }}
              placeholder="Updates, backups, uptime checks"
              className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
            />
          </label>
          <label className="flex items-end gap-2 text-xs text-neutral-500">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => {
                setIsActive(event.target.checked);
                setSaved(false);
              }}
              className="accent-orange-500"
            />
            Active
          </label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={busy || !planName.trim()}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save care plan"}
            </button>
            {saved && <span className="text-xs text-green-400">Saved.</span>}
          </div>
        </form>
      </PortalCard>
    </>
  );
}
