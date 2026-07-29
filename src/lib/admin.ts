import { functionsUrl, getSupabase, supabaseAnonKey } from "@/lib/supabase";
import type {
  AccessRequestRow,
  CarePlanRow,
  ClientRow,
  LeadRow,
  MessageRow,
  ProfileRow,
  ProjectRow,
  ProjectStatus,
  UpdateRow,
} from "@/lib/database.types";

/**
 * Admin-side queries. These read broadly on purpose: the same RLS policies that
 * scope a client to one tenant grant an admin full visibility, so a non-admin
 * session running any of this gets empty results rather than a leak.
 */

export type AdminOverview = {
  clients: ClientRow[];
  projects: ProjectRow[];
  openUpdates: UpdateRow[];
  unreadMessages: MessageRow[];
  newLeads: LeadRow[];
  pendingRequests: AccessRequestRow[];
  renewals: CarePlanRow[];
};

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const supabase = getSupabase();

  const [clients, projects, updates, messages, leads, requests, care] =
    await Promise.all([
      supabase.from("clients").select("*").order("business_name"),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("updates").select("*").eq("done", false),
      // Unread here means "the client wrote and I have not opened it".
      supabase
        .from("messages")
        .select("*")
        .eq("from_admin", false)
        .is("read_at", null)
        .order("created_at", { ascending: false }),
      supabase
        .from("leads")
        .select("*")
        .eq("status", "new")
        .order("created_at", { ascending: false }),
      supabase
        .from("access_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase.from("care_plans").select("*").eq("active", true),
    ]);

  return {
    clients: clients.data ?? [],
    projects: projects.data ?? [],
    openUpdates: updates.data ?? [],
    unreadMessages: messages.data ?? [],
    newLeads: leads.data ?? [],
    pendingRequests: requests.data ?? [],
    renewals: care.data ?? [],
  };
}

export type AdminClientDetail = {
  client: ClientRow;
  projects: ProjectRow[];
  updates: UpdateRow[];
  care: CarePlanRow | null;
  messages: MessageRow[];
  members: ProfileRow[];
};

export async function fetchClientDetail(
  clientId: string
): Promise<AdminClientDetail | null> {
  const supabase = getSupabase();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();

  if (!client) return null;

  const [projects, care, messages, members] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at"),
    supabase.from("care_plans").select("*").eq("client_id", clientId).maybeSingle(),
    supabase
      .from("messages")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at"),
    supabase.from("profiles").select("*").eq("client_id", clientId),
  ]);

  const projectIds = (projects.data ?? []).map((project) => project.id);
  let updates: UpdateRow[] = [];
  if (projectIds.length > 0) {
    const { data } = await supabase
      .from("updates")
      .select("*")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false });
    updates = data ?? [];
  }

  return {
    client,
    projects: projects.data ?? [],
    updates,
    care: care.data ?? null,
    messages: messages.data ?? [],
    members: members.data ?? [],
  };
}

export async function fetchAllClients(): Promise<ClientRow[]> {
  const { data } = await getSupabase()
    .from("clients")
    .select("*")
    .order("business_name");
  return data ?? [];
}

export async function fetchAllProjects(): Promise<ProjectRow[]> {
  const { data } = await getSupabase()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchAllMessages(): Promise<MessageRow[]> {
  const { data } = await getSupabase()
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchLeads(): Promise<LeadRow[]> {
  const { data } = await getSupabase()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchAccessRequests(): Promise<AccessRequestRow[]> {
  const { data } = await getSupabase()
    .from("access_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchUnassignedProfiles(): Promise<ProfileRow[]> {
  const { data } = await getSupabase()
    .from("profiles")
    .select("*")
    .eq("role", "pending")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createClient(input: {
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  industry?: string;
  access_key?: string;
}): Promise<ClientRow> {
  const { data, error } = await getSupabase()
    .from("clients")
    .insert({
      business_name: input.business_name,
      contact_name: input.contact_name ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      industry: input.industry ?? null,
      since: String(new Date().getFullYear()),
      access_key: input.access_key ?? null,
      access_key_created_at: input.access_key ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setClientAccessKey(
  clientId: string,
  key: string | null
): Promise<void> {
  const { error } = await getSupabase()
    .from("clients")
    .update({
      access_key: key,
      access_key_created_at: key ? new Date().toISOString() : null,
    })
    .eq("id", clientId);
  if (error) throw error;
}

const ACCESS_KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateAccessKey(length = 8): string {
  let key = "";
  for (let i = 0; i < length; i++) {
    key += ACCESS_KEY_CHARS[Math.floor(Math.random() * ACCESS_KEY_CHARS.length)];
  }
  return key;
}

export async function updateClient(
  clientId: string,
  patch: Partial<ClientRow>
): Promise<void> {
  const { error } = await getSupabase()
    .from("clients")
    .update(patch)
    .eq("id", clientId);
  if (error) throw error;
}

export async function createProject(input: {
  client_id: string;
  name: string;
  url?: string;
  status?: ProjectStatus;
  services?: string[];
  note?: string;
}): Promise<string> {
  const { data, error } = await getSupabase()
    .from("projects")
    .insert({
      client_id: input.client_id,
      name: input.name,
      url: input.url ?? null,
      status: input.status ?? "queued",
      services: input.services ?? [],
      note: input.note ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

/**
 * Full project edit — name, URL, status, services, note. createProject() and
 * setProjectStatus() only ever covered creation and a status flip; nothing
 * let an admin fix a typo'd name or URL afterwards.
 */
export async function updateProject(
  projectId: string,
  patch: Partial<
    Pick<ProjectRow, "name" | "url" | "status" | "services" | "note">
  >
): Promise<void> {
  const { error } = await getSupabase()
    .from("projects")
    .update(patch)
    .eq("id", projectId);
  if (error) throw error;
}

/**
 * Setting status to "in review" is the one transition a client actually
 * needs to be told about — it means their input is next. Rather than build a
 * parallel email path, this creates the update item the notify-update
 * function already expects and sends through it. Best-effort: a failed
 * notification never blocks the status change itself.
 */
export async function setProjectStatus(
  projectId: string,
  status: ProjectStatus
): Promise<void> {
  const { error } = await getSupabase()
    .from("projects")
    .update({ status })
    .eq("id", projectId);
  if (error) throw error;

  if (status === "in review") {
    try {
      const { data: created } = await getSupabase()
        .from("updates")
        .insert({
          project_id: projectId,
          body: "This project is ready for your review.",
        })
        .select("id")
        .single();
      if (created) await notifyUpdateEmail(created.id);
    } catch {
      // Best-effort notification; the status change above already succeeded.
    }
  }
}

export async function createUpdate(input: {
  project_id: string;
  body: string;
  due_date?: string;
}): Promise<void> {
  const { data, error } = await getSupabase()
    .from("updates")
    .insert({
      project_id: input.project_id,
      body: input.body,
      due_date: input.due_date ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  if (data) {
    try {
      await notifyUpdateEmail(data.id);
    } catch {
      // Best-effort; the update item itself was created successfully.
    }
  }
}

/**
 * Emails a client through the notify-update Edge Function that an update
 * needs their attention. Silently no-ops if there is no session or the
 * function is unreachable — the caller already has the update saved.
 */
export async function notifyUpdateEmail(
  updateId: string
): Promise<{ emailed: boolean }> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { emailed: false };

  try {
    const response = await fetch(functionsUrl("notify-update"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ update_id: updateId }),
    });
    if (response.ok) {
      const body = await response.json().catch(() => ({}));
      return { emailed: Boolean(body.emailed) };
    }
  } catch {
    // Function not deployed or unreachable.
  }
  return { emailed: false };
}

export async function toggleUpdateDone(
  updateId: string,
  done: boolean
): Promise<void> {
  const { error } = await getSupabase()
    .from("updates")
    .update({ done })
    .eq("id", updateId);
  if (error) throw error;
}

export async function upsertCarePlan(input: {
  client_id: string;
  plan: string;
  active: boolean;
  renews_at?: string | null;
  included?: string[];
}): Promise<void> {
  const { error } = await getSupabase()
    .from("care_plans")
    .upsert(
      {
        client_id: input.client_id,
        plan: input.plan,
        active: input.active,
        renews_at: input.renews_at ?? null,
        included: input.included ?? [],
      },
      { onConflict: "client_id" }
    );
  if (error) throw error;
}

export async function assignProfileToClient(
  profileId: string,
  clientId: string
): Promise<void> {
  const { error } = await getSupabase()
    .from("profiles")
    .update({ role: "client", client_id: clientId })
    .eq("id", profileId);
  if (error) throw error;
}

export async function toggleAdmin(profileId: string, makeAdmin: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from("profiles")
    .update({ role: makeAdmin ? "admin" : "pending" })
    .eq("id", profileId);
  if (error) throw error;
}

export async function reviewAccessRequest(
  requestId: string,
  status: "approved" | "denied"
): Promise<void> {
  const { error } = await getSupabase()
    .from("access_requests")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", requestId);
  if (error) throw error;
}

export async function setLeadStatus(
  leadId: string,
  status: LeadRow["status"]
): Promise<void> {
  const { error } = await getSupabase()
    .from("leads")
    .update({ status })
    .eq("id", leadId);
  if (error) throw error;
}

/**
 * Marks a lead converted AND records which client it became. The plain
 * setLeadStatus(id, "converted") call used to leave leads.client_id null
 * even though the column exists — this is the fix, used by
 * OnboardClientDialog whenever it starts from a lead.
 */
export async function convertLead(
  leadId: string,
  clientId: string
): Promise<void> {
  const { error } = await getSupabase()
    .from("leads")
    .update({ status: "converted", client_id: clientId })
    .eq("id", leadId);
  if (error) throw error;
}

export async function fetchProjectUpdates(projectId: string): Promise<UpdateRow[]> {
  const { data, error } = await getSupabase()
    .from("updates")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Project files for the admin-side project detail panel. */
export async function fetchProjectFiles(projectId: string) {
  const { data, error } = await getSupabase()
    .from("files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Admin-only. Creates a client record AND sends an email invite to the
 * contact so they can set a password and access their dashboard.
 * Uses the invite-client Edge Function (service_role) because the browser
 * cannot call auth.admin.inviteUserByEmail.
 */
export async function inviteClient(input: {
  business_name: string;
  contact_name?: string;
  email: string;
}): Promise<{ client: ClientRow; invited: boolean; error?: string }> {
  const session = (await getSupabase().auth.getSession()).data.session;
  const res = await fetch(functionsUrl("invite-client"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Invite failed (${res.status})`);
  }

  return res.json();
}

export async function markClientMessagesRead(clientId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("client_id", clientId)
    .eq("from_admin", false)
    .is("read_at", null);
  if (error) throw error;
}

/**
 * Sends an admin message through the send-message Edge Function so the client
 * also gets an email. Falls back to a direct insert when email is not
 * configured, so the thread still works without Resend.
 */
export async function sendAdminMessage(
  clientId: string,
  body: string
): Promise<{ emailed: boolean }> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    try {
      const response = await fetch(functionsUrl("send-message"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({ client_id: clientId, body }),
      });

      if (response.ok) return { emailed: true };
    } catch {
      // Function not deployed or unreachable; fall through to a direct insert.
    }
  }

  const { error } = await supabase
    .from("messages")
    .insert({ client_id: clientId, body });
  if (error) throw error;
  return { emailed: false };
}

/** Broadcasts one message to several clients, one row per client. */
export async function broadcastMessage(
  clientIds: string[],
  body: string
): Promise<void> {
  const { error } = await getSupabase()
    .from("messages")
    .insert(clientIds.map((clientId) => ({ client_id: clientId, body })));
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export async function notifyNewLead(payload: { name: string; email: string; message: string }) {
  try {
    await fetch("https://notify.dasdev.net/dasdev-leads", {
      method: "POST",
      body: `New lead: ${payload.name} (${payload.email})\n${payload.message}`,
    });
  } catch { /* ignore network errors */ }
}

export async function notifyNewClient(client: ClientRow, accessKey?: string | null) {
  try {
    const body = accessKey
      ? `New client: ${client.business_name}\nAccess key: ${accessKey}\nContact: ${client.contact_name || "—"} / ${client.email || "—"}`
      : `New client: ${client.business_name}\nContact: ${client.contact_name || "—"} / ${client.email || "—"}`;
    await fetch("https://notify.dasdev.net/dasdev-clients", {
      method: "POST",
      body,
    });
  } catch { /* ignore */ }
}

export async function notifyKeyGenerated(client: ClientRow, key: string) {
  try {
    await fetch("https://notify.dasdev.net/dasdev-clients", {
      method: "POST",
      body: `Key generated for ${client.business_name}: ${key}`,
    });
  } catch { /* ignore */ }
}

export async function deleteClient(clientId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("clients")
    .delete()
    .eq("id", clientId);
  if (error) throw error;
}
