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
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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
}): Promise<void> {
  const { error } = await getSupabase()
    .from("projects")
    .insert({
      client_id: input.client_id,
      name: input.name,
      url: input.url ?? null,
      status: input.status ?? "queued",
      services: input.services ?? [],
      note: input.note ?? null,
    });
  if (error) throw error;
}

export async function setProjectStatus(
  projectId: string,
  status: ProjectStatus
): Promise<void> {
  const { error } = await getSupabase()
    .from("projects")
    .update({ status })
    .eq("id", projectId);
  if (error) throw error;
}

export async function createUpdate(input: {
  project_id: string;
  body: string;
  due_date?: string;
}): Promise<void> {
  const { error } = await getSupabase().from("updates").insert({
    project_id: input.project_id,
    body: input.body,
    due_date: input.due_date ?? null,
  });
  if (error) throw error;
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
