-- DasDev client portal: core schema.
--
-- Every table here is RLS-protected in 0002_rls_policies.sql. Postgres denies
-- all access to an RLS-enabled table that has no matching policy, so the
-- default posture is deny and each policy is an explicit grant.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

-- 'pending' is where self-signups land: authenticated, but attached to no
-- client, so every policy below resolves to zero rows for them.
create type app_role as enum ('admin', 'client', 'pending');

create type project_status as enum ('queued', 'in progress', 'in review', 'live');

create type client_status as enum ('active', 'paused', 'archived');

create type lead_status as enum ('new', 'contacted', 'converted', 'archived');

create type request_status as enum ('pending', 'approved', 'denied');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table clients (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text,
  email text,
  phone text,
  industry text,
  status client_status not null default 'active',
  since text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per auth user. Mirrors auth.users, which is not directly queryable
-- from the browser.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role app_role not null default 'pending',
  full_name text,
  client_id uuid references clients (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A client login is meaningless without a client to look at, and an admin
  -- must not be scoped to a single client.
  constraint client_role_requires_client
    check (role <> 'client' or client_id is not null),
  constraint admin_has_no_client
    check (role <> 'admin' or client_id is null)
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  name text not null,
  url text,
  status project_status not null default 'queued',
  -- Service ids from src/lib/services.ts, kept as text so the catalog can grow
  -- without a migration.
  services text[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  body text not null,
  done boolean not null default false,
  -- Set when a client acknowledges the item, so "done" and "client signed off"
  -- stay distinguishable.
  acknowledged_at timestamptz,
  due_date date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  sender_id uuid references auth.users (id) on delete set null,
  -- Derived by trigger from the sender's role, never from client input, so a
  -- client cannot post a message that appears to come from DasDev.
  from_admin boolean not null default false,
  body text not null,
  -- Optional service id when the message is a request for more work.
  service_id text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint message_body_not_blank check (length(btrim(body)) > 0),
  constraint message_body_length check (length(body) <= 5000)
);

create table care_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  plan text not null,
  active boolean not null default true,
  renews_at date,
  included text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A client has at most one care plan at a time.
  unique (client_id)
);

create table files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  project_id uuid references projects (id) on delete set null,
  storage_path text not null unique,
  label text not null,
  size_bytes bigint,
  content_type text,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Signup requests from authenticated users who have no client yet.
create table access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_name text not null,
  message text,
  status request_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  unique (user_id)
);

-- Inbound contact-form submissions. Written only by the submit-lead Edge
-- Function after it verifies a Turnstile token; there is deliberately no
-- anonymous insert policy.
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  service_id text,
  source text not null default 'contact-form',
  status lead_status not null default 'new',
  client_id uuid references clients (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index profiles_client_id_idx on profiles (client_id);
create index projects_client_id_idx on projects (client_id);
create index projects_status_idx on projects (status);
create index updates_project_id_idx on updates (project_id);
create index updates_open_idx on updates (project_id) where not done;
create index messages_client_created_idx on messages (client_id, created_at desc);
create index messages_unread_idx on messages (client_id) where read_at is null;
create index files_client_id_idx on files (client_id);
create index care_plans_client_id_idx on care_plans (client_id);
create index leads_status_idx on leads (status, created_at desc);
create index access_requests_status_idx on access_requests (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Helper functions
--
-- These are SECURITY DEFINER so they bypass RLS. A policy on profiles that
-- queried profiles directly would recurse infinitely; routing the lookup
-- through a definer function breaks that cycle. search_path is pinned so a
-- caller cannot shadow `profiles` with their own table.
-- ---------------------------------------------------------------------------

create or replace function public.current_role()
returns app_role
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.current_client_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select client_id from public.profiles where id = auth.uid();
$$;

-- True for the DasDev admin, and for trusted server-side connections which have
-- no JWT subject: the service_role key, Edge Functions, and the Supabase SQL
-- editor. Without this, the guard triggers below would also block the initial
-- admin bootstrap and every Edge Function write.
--
-- A browser holding only the anon key cannot exploit the null-uid branch,
-- because no policy in 0002 grants the anon role any write on these tables, so
-- an anonymous statement never reaches a guard trigger.
create or replace function public.is_privileged()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_admin() or auth.uid() is null;
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger clients_touch before update on clients
  for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on profiles
  for each row execute function public.touch_updated_at();
create trigger projects_touch before update on projects
  for each row execute function public.touch_updated_at();
create trigger updates_touch before update on updates
  for each row execute function public.touch_updated_at();
create trigger care_plans_touch before update on care_plans
  for each row execute function public.touch_updated_at();

-- Privilege escalation guard. An UPDATE policy in Postgres cannot restrict
-- which columns change, so without this a client permitted to edit their own
-- profile row could set role = 'admin' or repoint client_id at someone else.
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.is_privileged() then
    return new;
  end if;

  if new.role is distinct from old.role then
    raise exception 'role cannot be changed by the account holder';
  end if;

  if new.client_id is distinct from old.client_id then
    raise exception 'client assignment cannot be changed by the account holder';
  end if;

  return new;
end;
$$;

create trigger profiles_guard_privileges before update on profiles
  for each row execute function public.guard_profile_privileges();

-- Message provenance is server-derived: the sender is always the caller, and
-- from_admin always reflects the caller's real role.
create or replace function public.set_message_sender()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.sender_id := auth.uid();
  new.from_admin := public.is_admin();
  new.read_at := null;
  return new;
end;
$$;

create trigger messages_set_sender before insert on messages
  for each row execute function public.set_message_sender();

-- Every new auth user gets a 'pending' profile. Without this, a signed-up user
-- would have no profile row and every helper function would return null.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    'pending',
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
