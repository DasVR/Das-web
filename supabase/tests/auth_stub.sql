-- Local stand-ins for the pieces Supabase provides.
--
-- Only used by the test harness; never applied to a real Supabase project,
-- where these roles, schemas, and functions already exist.

create role anon;
create role authenticated;
create role service_role;

create schema if not exists auth;
create schema if not exists storage;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;

-- Minimal shape of auth.users: the columns the triggers touch.
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Supabase derives auth.uid() from the request JWT claims, which the client
-- sets per connection. The test harness sets the same GUC.
-- The inner nullif matters: an unset GUC reads back as '' after a RESET, and
-- ''::jsonb raises instead of yielding null, which would mask real failures
-- behind a JSON syntax error.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub',
    ''
  )::uuid;
$$;

create extension if not exists "pgcrypto";

-- Storage stubs so 0004_storage.sql applies unchanged.
create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text not null,
  owner uuid,
  created_at timestamptz not null default now()
);

alter table storage.objects enable row level security;

create or replace function storage.foldername(name text)
returns text[]
language sql
immutable
as $$
  select string_to_array(name, '/');
$$;

grant usage on schema storage to anon, authenticated, service_role;
grant select on storage.objects to authenticated;
grant insert, update, delete on storage.objects to authenticated;

-- Table privileges. Supabase grants these to anon/authenticated by default and
-- relies on RLS for row visibility; mirror that so the tests exercise policies
-- rather than missing grants.
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage, select on sequences to authenticated;
