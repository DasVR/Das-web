"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "@/components/portal/AdminGate";
import {
  EmptyState,
  PortalCard,
  PortalNotice,
  SectionTitle,
} from "@/components/portal/PortalShell";
import {
  assignProfileToClient,
  createClient,
  fetchAccessRequests,
  fetchLeads,
  generateAccessKey,
  notifyNewClient,
  reviewAccessRequest,
  setClientAccessKey,
  setLeadStatus,
} from "@/lib/admin";
import { formatDate } from "@/lib/dashboard";
import type { AccessRequestRow, LeadRow } from "@/lib/database.types";
import { getServiceName } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AdminLeads() {
  return (
    <AdminGate>
      <LeadsBody />
    </AdminGate>
  );
}

function LeadsBody() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [requests, setRequests] = useState<AccessRequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [nextLeads, nextRequests] = await Promise.all([
        fetchLeads(),
        fetchAccessRequests(),
      ]);
      setLeads(nextLeads);
      setRequests(nextRequests);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load leads.");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void load();
  }, [load]);

  async function convertLead(lead: LeadRow) {
    try {
      const key = generateAccessKey();
      const client = await createClient({
        business_name: lead.name,
        contact_name: lead.name,
        email: lead.email,
        access_key: key,
      });
      await setLeadStatus(lead.id, "converted");
      await notifyNewClient(client, key);
      setNotice(`${client.business_name} created. Access key: ${key}`);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not convert lead.");
    }
  }

  async function approveRequest(request: AccessRequestRow) {
    try {
      const key = generateAccessKey();
      const client = await createClient({
        business_name: request.business_name,
      });
      // Link the account to the new client
      await assignProfileToClient(request.user_id, client.id);
      await reviewAccessRequest(request.id, "approved");
      // Give them the access key so they can log in
      await setClientAccessKey(client.id, key);
      await notifyNewClient(client, key);
      setNotice(`${request.business_name} approved. Access key: ${key}`);
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not approve the request."
      );
    }
  }

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );
  const openLeads = leads.filter((lead) => lead.status !== "archived");

  return (
    <>
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          {pendingRequests.length} request
          {pendingRequests.length === 1 ? "" : "s"} · {openLeads.length} lead
          {openLeads.length === 1 ? "" : "s"}
        </p>
        <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
          Leads
        </h1>
      </header>

      {error && (
        <div className="mb-4">
          <PortalNotice tone="error">{error}</PortalNotice>
        </div>
      )}
      {notice && (
        <div className="mb-4">
          <PortalNotice tone="success">{notice}</PortalNotice>
        </div>
      )}

      <section className="mb-8">
        <SectionTitle>Access requests</SectionTitle>
        {pendingRequests.length === 0 ? (
          <EmptyState
            title="No requests waiting"
            body="Signups from the portal appear here for approval."
          />
        ) : (
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <PortalCard key={request.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {request.business_name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Requested {formatDate(request.created_at)}
                    </p>
                    {request.message && (
                      <p className="mt-1 text-xs text-neutral-400">
                        {request.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => approveRequest(request)}
                      className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-200"
                    >
                      Approve and create client
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await reviewAccessRequest(request.id, "denied");
                        await load();
                      }}
                      className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-600"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </PortalCard>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle>Contact form</SectionTitle>
        {openLeads.length === 0 ? (
          <EmptyState
            title="No inbound leads"
            body={
              <>
                Submissions land here once the submit-lead function is deployed.
                See{" "}
                <Link href="/contact" className="underline">
                  the contact page
                </Link>
                .
              </>
            }
          />
        ) : (
          <div className="space-y-2">
            {openLeads.map((lead) => (
              <PortalCard key={lead.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {lead.name}{" "}
                      <span className="font-normal text-neutral-500">
                        · {lead.email}
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                      {lead.message}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-neutral-600">
                      {formatDate(lead.created_at)} · {lead.source}
                      {lead.service_id
                        ? ` · ${getServiceName(lead.service_id)}`
                        : ""}
                      {` · ${lead.status}`}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    {lead.status === "new" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await setLeadStatus(lead.id, "contacted");
                          await load();
                        }}
                        className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-600"
                      >
                        Mark contacted
                      </button>
                    )}
                    {lead.status !== "converted" && (
                      <>
                        <button
                          type="button"
                          onClick={() => convertLead(lead)}
                          className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-200"
                        >
                          Convert to client
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const key = generateAccessKey();
                              const client = await createClient({
                                business_name: lead.name,
                                contact_name: lead.name,
                                email: lead.email,
                                access_key: key,
                              });
                              await setLeadStatus(lead.id, "converted");
                              await notifyNewClient(client, key);
                              setNotice(`Key for ${client.business_name}: ${key}`);
                              await load();
                            } catch (cause) {
                              setError(
                                cause instanceof Error
                                  ? cause.message
                                  : "Could not create client."
                              );
                            }
                          }}
                          className="rounded-md border border-orange-500/40 px-3 py-1.5 text-xs text-orange-300 transition-colors hover:border-orange-400 hover:text-orange-200"
                        >
                          Generate key
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        await setLeadStatus(lead.id, "archived");
                        await load();
                      }}
                      className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-neutral-600"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </PortalCard>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
