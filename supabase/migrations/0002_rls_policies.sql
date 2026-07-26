-- DasDev client portal: row level security.
--
-- The browser holds the anon key, which is public by design. These policies are
-- the only thing standing between one client and another client's data, so the
-- rules are written explicitly per table and per operation rather than relying
-- on a permissive catch-all.
--
-- Shape of every client-facing read: "the row belongs to my client_id".
-- Shape of every client-facing write: nothing, except posting a message and
-- acknowledging an update.

alter table clients enable row level security;
alter table profiles enable row level security;
alter table projects enable row level security;
alter table updates enable row level security;
alter table messages enable row level security;
alter table care_plans enable row level security;
alter table files enable row level security;
alter table access_requests enable row level security;
alter table leads enable row level security;

-- Force RLS for the table owner too, so a definer function or superuser-owned
-- connection cannot quietly sidestep these rules.
alter table clients force row level security;
alter table profiles force row level security;
alter table projects force row level security;
alter table updates force row level security;
alter table messages force row level security;
alter table care_plans force row level security;
alter table files force row level security;
alter table access_requests force row level security;
alter table leads force row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy profiles_select_own on profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Column-level protection lives in the guard_profile_privileges trigger.
create policy profiles_update_own on profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy profiles_admin_insert on profiles
  for insert to authenticated
  with check (public.is_admin());

create policy profiles_admin_delete on profiles
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------

create policy clients_select_own on clients
  for select to authenticated
  using (id = public.current_client_id() or public.is_admin());

create policy clients_admin_insert on clients
  for insert to authenticated
  with check (public.is_admin());

create policy clients_admin_update on clients
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy clients_admin_delete on clients
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

create policy projects_select_own on projects
  for select to authenticated
  using (client_id = public.current_client_id() or public.is_admin());

create policy projects_admin_insert on projects
  for insert to authenticated
  with check (public.is_admin());

create policy projects_admin_update on projects
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy projects_admin_delete on projects
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- updates
-- ---------------------------------------------------------------------------

create policy updates_select_own on updates
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from projects p
      where p.id = updates.project_id
        and p.client_id = public.current_client_id()
    )
  );

-- Clients may acknowledge an item on their own project. The guard below keeps
-- that from turning into free edit access: body, done, and project_id must be
-- unchanged, which an UPDATE policy alone cannot express.
create policy updates_client_acknowledge on updates
  for update to authenticated
  using (
    exists (
      select 1 from projects p
      where p.id = updates.project_id
        and p.client_id = public.current_client_id()
    )
  )
  with check (
    exists (
      select 1 from projects p
      where p.id = updates.project_id
        and p.client_id = public.current_client_id()
    )
  );

create policy updates_admin_insert on updates
  for insert to authenticated
  with check (public.is_admin());

create policy updates_admin_update on updates
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy updates_admin_delete on updates
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------

create policy messages_select_own on messages
  for select to authenticated
  using (client_id = public.current_client_id() or public.is_admin());

-- sender_id and from_admin are overwritten by the set_message_sender trigger,
-- so the only thing this check has to enforce is the target client.
create policy messages_insert_own on messages
  for insert to authenticated
  with check (client_id = public.current_client_id() or public.is_admin());

-- Marking as read. Editing history is not permitted for either party; the
-- immutability guard in 0003 enforces that.
create policy messages_update_read on messages
  for update to authenticated
  using (client_id = public.current_client_id() or public.is_admin())
  with check (client_id = public.current_client_id() or public.is_admin());

create policy messages_admin_delete on messages
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- care_plans
-- ---------------------------------------------------------------------------

create policy care_plans_select_own on care_plans
  for select to authenticated
  using (client_id = public.current_client_id() or public.is_admin());

create policy care_plans_admin_insert on care_plans
  for insert to authenticated
  with check (public.is_admin());

create policy care_plans_admin_update on care_plans
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy care_plans_admin_delete on care_plans
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- files
-- ---------------------------------------------------------------------------

create policy files_select_own on files
  for select to authenticated
  using (client_id = public.current_client_id() or public.is_admin());

create policy files_admin_insert on files
  for insert to authenticated
  with check (public.is_admin());

create policy files_admin_update on files
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy files_admin_delete on files
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- access_requests
-- ---------------------------------------------------------------------------

create policy access_requests_select_own on access_requests
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- A signed-up user may file exactly one request, for themselves.
create policy access_requests_insert_self on access_requests
  for insert to authenticated
  with check (user_id = auth.uid());

create policy access_requests_admin_update on access_requests
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy access_requests_admin_delete on access_requests
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- leads
--
-- Admin-read only. Inserts come from the submit-lead Edge Function using the
-- service_role key, which bypasses RLS, so no insert policy is granted to
-- authenticated or anon. That keeps the contact form from becoming an open
-- write endpoint into the database.
-- ---------------------------------------------------------------------------

create policy leads_admin_select on leads
  for select to authenticated
  using (public.is_admin());

create policy leads_admin_update on leads
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy leads_admin_delete on leads
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Function execution
-- ---------------------------------------------------------------------------

revoke all on function public.current_role() from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.current_client_id() from public, anon;
revoke all on function public.is_privileged() from public, anon;

grant execute on function public.current_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_client_id() to authenticated;
