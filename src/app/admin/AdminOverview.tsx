"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "@/components/portal/AdminGate";
import {
  EmptyState,
  PortalCard,
  PortalNotice,
  SectionTitle,
} from "@/components/portal/PortalShell";
import { fetchAdminOverview, type AdminOverview as Overview } from "@/lib/admin";
import { formatDate, statusBadgeClass } from "@/lib/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AdminOverview() {
  return (
    <AdminGate>
      <OverviewBody />
    </AdminGate>
  );
}

function OverviewBody() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchAdminOverview()
      .then(setData)
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Could not load data.")
      );
  }, []);

  if (error) return <PortalNotice tone="error">{error}</PortalNotice>;
  if (!data) return <p className="text-sm text-neutral-500">Loading…</p>;

  const activeClients = data.clients.filter(
    (client) => client.status === "active"
  );

  const stats = [
    { label: "Active clients", value: activeClients.length, href: "/admin/clients" },
    { label: "Open items", value: data.openUpdates.length, href: "/admin/projects" },
    { label: "Unread messages", value: data.unreadMessages.length, href: "/admin/messages" },
    { label: "New leads", value: data.newLeads.length, href: "/admin/leads" },
  ];

  return (
    <>
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          DasDev admin
        </p>
        <h1 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
          Overview
        </h1>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <PortalCard className="transition-colors hover:border-neutral-600">
              <p className="text-xl font-medium sm:text-2xl">{stat.value}</p>
              <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">
                {stat.label}
              </p>
            </PortalCard>
          </Link>
        ))}
      </div>

      {data.pendingRequests.length > 0 && (
        <section className="mb-8">
          <SectionTitle
            action={
              <Link
                href="/admin/leads"
                className="text-xs text-neutral-500 hover:text-neutral-300"
              >
                Review
              </Link>
            }
          >
            Access requests waiting
          </SectionTitle>
          <div className="space-y-2">
            {data.pendingRequests.slice(0, 4).map((request) => (
              <PortalCard key={request.id} className="px-4 py-3">
                <p className="text-sm">{request.business_name}</p>
                <p className="text-[11px] text-neutral-600">
                  Requested {formatDate(request.created_at)}
                </p>
              </PortalCard>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <SectionTitle
          action={
            <Link
              href="/admin/clients"
              className="text-xs text-neutral-500 hover:text-neutral-300"
            >
              All clients
            </Link>
          }
        >
          Clients
        </SectionTitle>

        {data.clients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            body={
              <>
                Add your first client from{" "}
                <Link href="/admin/clients" className="underline">
                  Clients
                </Link>
                .
              </>
            }
          />
        ) : (
          <div className="space-y-2">
            {data.clients.slice(0, 6).map((client) => {
              const clientProjects = data.projects.filter(
                (project) => project.client_id === client.id
              );
              return (
                <Link key={client.id} href={`/admin/clients/detail?id=${client.id}`}>
                  <PortalCard className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-neutral-600">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {client.business_name}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {client.industry ?? "—"} · {clientProjects.length} project
                        {clientProjects.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                      {client.status}
                    </span>
                  </PortalCard>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle>Recent projects</SectionTitle>
        {data.projects.length === 0 ? (
          <EmptyState title="No projects yet" body="Projects appear here once created." />
        ) : (
          <div className="space-y-2">
            {data.projects.slice(0, 6).map((project) => {
              const client = data.clients.find((c) => c.id === project.client_id);
              return (
                <PortalCard
                  key={project.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">{project.name}</p>
                    <p className="truncate text-xs text-neutral-500">
                      {client?.business_name ?? "Unassigned"}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadgeClass(project.status)}`}
                  >
                    {project.status}
                  </span>
                </PortalCard>
              );
            })}
          </div>
        )}
      </section>

      {data.renewals.length > 0 && (
        <section>
          <SectionTitle>Care renewals</SectionTitle>
          <div className="space-y-2">
            {data.renewals.map((plan) => {
              const client = data.clients.find((c) => c.id === plan.client_id);
              return (
                <PortalCard
                  key={plan.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <p className="truncate text-sm">
                    {client?.business_name ?? "Unknown"} · {plan.plan}
                  </p>
                  <span className="flex-shrink-0 font-mono text-[10px] text-neutral-500">
                    {plan.renews_at ? formatDate(plan.renews_at) : "no date"}
                  </span>
                </PortalCard>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
