/**
 * Hand-maintained mirror of supabase/migrations. Kept in the repo rather than
 * generated so a build never depends on reaching a Supabase project.
 *
 * Regenerate the authoritative version with:
 *   supabase gen types typescript --linked > src/lib/database.types.ts
 */

export type AppRole = "admin" | "client" | "pending";
export type ProjectStatus = "queued" | "in progress" | "in review" | "live";
export type ClientStatus = "active" | "paused" | "archived";
export type LeadStatus = "new" | "contacted" | "converted" | "archived";
export type RequestStatus = "pending" | "approved" | "denied";

export type ProfileRow = {
  id: string;
  role: AppRole;
  full_name: string | null;
  client_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientRow = {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  status: ClientStatus;
  since: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  client_id: string;
  name: string;
  url: string | null;
  status: ProjectStatus;
  services: string[];
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type UpdateRow = {
  id: string;
  project_id: string;
  body: string;
  done: boolean;
  acknowledged_at: string | null;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  client_id: string;
  sender_id: string | null;
  from_admin: boolean;
  body: string;
  service_id: string | null;
  read_at: string | null;
  created_at: string;
};

export type CarePlanRow = {
  id: string;
  client_id: string;
  plan: string;
  active: boolean;
  renews_at: string | null;
  included: string[];
  created_at: string;
  updated_at: string;
};

export type FileRow = {
  id: string;
  client_id: string;
  project_id: string | null;
  storage_path: string;
  label: string;
  size_bytes: number | null;
  content_type: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export type AccessRequestRow = {
  id: string;
  user_id: string;
  business_name: string;
  message: string | null;
  status: RequestStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  service_id: string | null;
  source: string;
  status: LeadStatus;
  client_id: string | null;
  created_at: string;
};

/**
 * postgrest-js requires a Relationships field on every table to resolve its
 * query types; omitting it silently degrades every result to `never`. Nothing
 * here uses embedded resource selects, so an empty tuple is accurate.
 */
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow>;
      clients: Table<ClientRow, Omit<Partial<ClientRow>, "id"> & { business_name: string }>;
      projects: Table<
        ProjectRow,
        Omit<Partial<ProjectRow>, "id"> & { client_id: string; name: string }
      >;
      updates: Table<
        UpdateRow,
        Omit<Partial<UpdateRow>, "id"> & { project_id: string; body: string }
      >;
      messages: Table<
        MessageRow,
        // sender_id and from_admin are set by trigger, never sent by the client.
        { client_id: string; body: string; service_id?: string | null }
      >;
      care_plans: Table<
        CarePlanRow,
        Omit<Partial<CarePlanRow>, "id"> & { client_id: string; plan: string }
      >;
      files: Table<
        FileRow,
        Omit<Partial<FileRow>, "id"> & {
          client_id: string;
          storage_path: string;
          label: string;
        }
      >;
      access_requests: Table<
        AccessRequestRow,
        { user_id: string; business_name: string; message?: string | null }
      >;
      leads: Table<LeadRow>;
    };
    Views: Record<string, { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: {
      current_role: { Args: Record<string, never>; Returns: AppRole };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      current_client_id: { Args: Record<string, never>; Returns: string | null };
    };
    Enums: {
      app_role: AppRole;
      project_status: ProjectStatus;
      client_status: ClientStatus;
      lead_status: LeadStatus;
      request_status: RequestStatus;
    };
  };
};
