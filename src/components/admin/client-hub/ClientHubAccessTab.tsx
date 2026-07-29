"use client";

import { useEffect, useState } from "react";
import { EmptyState, PortalCard, SectionTitle } from "@/components/portal/PortalShell";
import { assignProfileToClient, fetchUnassignedProfiles, toggleAdmin } from "@/lib/admin";
import type { ClientRow, ProfileRow } from "@/lib/database.types";

export function ClientHubAccessTab({
  client,
  members,
  onChanged,
}: {
  client: ClientRow;
  members: ProfileRow[];
  onChanged: () => Promise<void>;
}) {
  const [unassigned, setUnassigned] = useState<ProfileRow[]>([]);

  useEffect(() => {
    let active = true;
    fetchUnassignedProfiles()
      .then((profiles) => {
        if (active) setUnassigned(profiles);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [client.id]);

  return (
    <>
      <SectionTitle>Linked accounts</SectionTitle>
      {members.length === 0 ? (
        <EmptyState
          title="No linked accounts"
          body="The client has not activated their workspace yet."
        />
      ) : (
        <div className="mb-8 space-y-2">
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
                    await onChanged();
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

      {unassigned.length > 0 && (
        <details className="rounded-lg border border-neutral-900 open:bg-[#0d0d0d]">
          <summary className="cursor-pointer select-none px-4 py-3 text-xs font-medium text-neutral-400">
            Link a pending signup ({unassigned.length})
          </summary>
          <div className="space-y-2 px-4 pb-4">
            <p className="text-[11px] text-neutral-600">
              Leftover from manual Supabase Auth signups — access-key
              activation normally links an account automatically, so this is
              a fallback, not the usual path.
            </p>
            {unassigned.map((profile) => (
              <PortalCard
                key={profile.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    {profile.full_name ?? "Unnamed account"}
                  </p>
                  <p className="truncate font-mono text-[10px] text-neutral-600">
                    {profile.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await assignProfileToClient(profile.id, client.id);
                    setUnassigned((current) => current.filter((p) => p.id !== profile.id));
                    await onChanged();
                  }}
                  className="flex-shrink-0 rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-600"
                >
                  Link to {client.business_name}
                </button>
              </PortalCard>
            ))}
          </div>
        </details>
      )}
    </>
  );
}
