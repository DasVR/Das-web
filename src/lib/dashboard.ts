import { getSupabase } from "@/lib/supabase";
import type {
  CarePlanRow,
  ClientRow,
  FileRow,
  MessageRow,
  ProjectRow,
  ProjectStatus,
  UpdateRow,
} from "@/lib/database.types";

export type { ProjectStatus };

/** A project plus the update items belonging to it. */
export type ProjectWithUpdates = ProjectRow & {
  updates: UpdateRow[];
  reviews: import("@/lib/database.types").ProjectReviewRow[];
};

export type ClientWorkspace = {
  client: ClientRow;
  projects: ProjectWithUpdates[];
  care: CarePlanRow | null;
  messages: MessageRow[];
  files: FileRow[];
};

/** Industries the portal is built to serve. Deliberately broad, not one vertical. */
export const supportedIndustries = [
  "Professional services",
  "Retail & makers",
  "Restaurants & hospitality",
  "Creators & studios",
  "Trades & home services",
  "Clinics & care",
  "Coaches & consultants",
  "Early startups",
] as const;

export function projectStatusCounts(projects: ProjectRow[]) {
  const counts: Record<ProjectStatus, number> = {
    live: 0,
    "in progress": 0,
    "in review": 0,
    queued: 0,
  };

  for (const project of projects) {
    counts[project.status] += 1;
  }

  return counts;
}

export function statusBadgeClass(status: ProjectStatus): string {
  switch (status) {
    case "live":
      return "bg-green-500/10 text-green-400";
    case "in review":
      return "bg-amber-500/10 text-amber-400";
    case "in progress":
      return "bg-sky-500/10 text-sky-400";
    case "queued":
      return "bg-neutral-500/10 text-neutral-400";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/**
 * Loads the signed-in client's workspace.
 *
 * No client_id filter is applied: RLS scopes every one of these tables to the
 * caller's own client, so a filter here would be cosmetic. An admin calling
 * this would see all rows, which is why the admin pages use their own queries.
 */
export async function fetchWorkspace(): Promise<ClientWorkspace | null> {
  const supabase = getSupabase();

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (clientError) throw clientError;
  if (!client) return null;

  const [projects, care, messages, files] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("care_plans")
      .select("*")
      .eq("client_id", client.id)
      .maybeSingle(),
    supabase
      .from("messages")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("files")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false }),
  ]);

  if (projects.error) throw projects.error;

  const projectIds = (projects.data ?? []).map((project) => project.id);
  let updates: UpdateRow[] = [];
  let reviews: import("@/lib/database.types").ProjectReviewRow[] = [];

  if (projectIds.length > 0) {
    const [{ data: uData, error: uError }, { data: rData, error: rError }] =
      await Promise.all([
        supabase
          .from("updates")
          .select("*")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_reviews")
          .select("*")
          .in("project_id", projectIds)
          .eq("active", true)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false }),
      ]);
    if (uError) throw uError;
    if (rError) throw rError;
    updates = uData ?? [];
    reviews = rData ?? [];
  }

  return {
    client,
    projects: (projects.data ?? []).map((project) => ({
      ...project,
      updates: updates.filter((update) => update.project_id === project.id),
      reviews: reviews.filter((review) => review.project_id === project.id),
    })),
    care: care.data ?? null,
    messages: messages.data ?? [],
    files: files.data ?? [],
  };
}

export function allUpdates(workspace: ClientWorkspace): UpdateRow[] {
  return workspace.projects.flatMap((project) => project.updates);
}

/** Posts a message from the client. Provenance is set by database trigger. */
export async function sendClientMessage(
  clientId: string,
  body: string,
  serviceId?: string
): Promise<void> {
  const { error } = await getSupabase()
    .from("messages")
    .insert({ client_id: clientId, body, service_id: serviceId ?? null });
  if (error) throw error;
}

export async function acknowledgeUpdate(updateId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("updates")
    .update({ acknowledged_at: new Date().toISOString() })
    .eq("id", updateId);
  if (error) throw error;
}

export async function markMessagesRead(clientId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("client_id", clientId)
    .is("read_at", null)
    .eq("from_admin", true);
  if (error) throw error;
}

/** Files live in a private bucket; hand out short-lived signed URLs only. */
export async function signedFileUrl(path: string): Promise<string | null> {
  const { data, error } = await getSupabase()
    .storage.from("client-files")
    .createSignedUrl(path, 60);
  if (error) return null;
  return data.signedUrl;
}
