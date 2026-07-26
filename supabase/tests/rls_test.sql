-- RLS regression test.
--
-- Runs the migrations against a local Postgres with a stubbed auth schema and
-- asserts the isolation properties the portal depends on. Every assertion is
-- phrased as an attack: if a check fails, the migration has opened a hole.
--
-- Run with: bash supabase/tests/run-rls-tests.sh

\set ON_ERROR_STOP on
-- Assertions report through RAISE NOTICE, so notices must stay visible.
set client_min_messages to notice;

-- ---------------------------------------------------------------------------
-- Assertion helpers
-- ---------------------------------------------------------------------------

create or replace function assert_equals(
  description text,
  actual anyelement,
  expected anyelement
) returns void language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'FAIL: % (got %, expected %)', description, actual, expected;
  end if;
  raise notice 'pass: %', description;
end;
$$;

-- Denial mode 1: the statement raises. Happens when a policy lets the row
-- through but a guard trigger or constraint rejects the change.
create or replace function assert_denied(
  description text,
  statement text
) returns void language plpgsql as $$
begin
  begin
    execute statement;
  exception when others then
    raise notice 'pass: % (blocked: %)', description, sqlerrm;
    return;
  end;
  raise exception 'FAIL: % was permitted but must be blocked', description;
end;
$$;

-- Denial mode 2: the statement succeeds but touches nothing. This is how RLS
-- refuses an UPDATE or DELETE: the rows are simply not visible to the caller,
-- so Postgres reports success with zero rows affected. Asserting "it raised"
-- would wrongly fail here, and asserting nothing would miss a real breach.
create or replace function assert_no_rows_affected(
  description text,
  statement text
) returns void language plpgsql as $$
declare
  affected bigint;
begin
  execute statement;
  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'FAIL: % affected % row(s), expected 0', description, affected;
  end if;
  raise notice 'pass: % (0 rows visible to caller)', description;
end;
$$;

-- Impersonate a signed-in Supabase user: auth.uid() reads the request JWT
-- claims, which the client library sets per connection.
create or replace function login_as(user_id uuid) returns void
language plpgsql as $$
begin
  execute format(
    'set local request.jwt.claims = %L',
    json_build_object('sub', user_id, 'role', 'authenticated')::text
  );
  set local role authenticated;
end;
$$;

-- ---------------------------------------------------------------------------
-- Seed data, created as the owner before any RLS impersonation.
-- ---------------------------------------------------------------------------

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin@dasdev.net', '{"full_name":"Arriq"}'),
  ('00000000-0000-0000-0000-0000000000b1', 'owner@northline.test', '{"full_name":"Jordan"}'),
  ('00000000-0000-0000-0000-0000000000c1', 'owner@harbor.test', '{"full_name":"Riley"}'),
  ('00000000-0000-0000-0000-0000000000d1', 'stranger@example.test', '{"full_name":"Stranger"}');

insert into clients (id, business_name, industry) values
  ('11111111-1111-1111-1111-111111111111', 'Northline Studio', 'Creative studio'),
  ('22222222-2222-2222-2222-222222222222', 'Harbor Dental', 'Clinic');

-- handle_new_user() already created 'pending' profiles; promote three of them.
update profiles set role = 'admin', client_id = null
  where id = '00000000-0000-0000-0000-0000000000a1';
update profiles set role = 'client', client_id = '11111111-1111-1111-1111-111111111111'
  where id = '00000000-0000-0000-0000-0000000000b1';
update profiles set role = 'client', client_id = '22222222-2222-2222-2222-222222222222'
  where id = '00000000-0000-0000-0000-0000000000c1';
-- The stranger stays 'pending'.

insert into projects (id, client_id, name, status, services) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Northline site', 'live', array['web-design']),
  ('bbbbbbbb-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Harbor site', 'in progress', array['web-design','seo']);

insert into updates (id, project_id, body) values
  ('aaaaaaaa-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'Approve hero copy'),
  ('bbbbbbbb-0000-0000-0000-000000000011', 'bbbbbbbb-0000-0000-0000-000000000001', 'Approve booking flow');

insert into care_plans (client_id, plan, renews_at) values
  ('11111111-1111-1111-1111-111111111111', 'Maintenance', '2026-09-01'),
  ('22222222-2222-2222-2222-222222222222', 'Maintenance', '2026-09-01');

insert into files (client_id, storage_path, label) values
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111/logo.zip', 'Logo pack'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222/xray.pdf', 'Brand guide');

insert into leads (name, email, message) values
  ('Prospect', 'prospect@example.test', 'Need a site');

-- Seed one admin message per client without tripping the sender trigger's
-- auth.uid() dependency.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
insert into messages (client_id, body) values
  ('11111111-1111-1111-1111-111111111111', 'Welcome to Northline workspace'),
  ('22222222-2222-2222-2222-222222222222', 'Welcome to Harbor workspace');
reset request.jwt.claims;

commit;

-- ---------------------------------------------------------------------------
-- Client A (Northline) sees only their own data
-- ---------------------------------------------------------------------------

begin;
select login_as('00000000-0000-0000-0000-0000000000b1');

select assert_equals('client sees only own client row',
  (select count(*)::int from clients), 1);
select assert_equals('client sees own business',
  (select business_name from clients), 'Northline Studio');
select assert_equals('client sees only own projects',
  (select count(*)::int from projects), 1);
select assert_equals('client sees only own updates',
  (select count(*)::int from updates), 1);
select assert_equals('client sees only own messages',
  (select count(*)::int from messages), 1);
select assert_equals('client sees only own care plan',
  (select count(*)::int from care_plans), 1);
select assert_equals('client sees only own files',
  (select count(*)::int from files), 1);
select assert_equals('client cannot read leads',
  (select count(*)::int from leads), 0);
select assert_equals('client sees only own profile',
  (select count(*)::int from profiles), 1);

-- Targeted cross-tenant reads
select assert_equals('client cannot read other client by id',
  (select count(*)::int from clients where id = '22222222-2222-2222-2222-222222222222'), 0);
select assert_equals('client cannot read other client project by id',
  (select count(*)::int from projects where id = 'bbbbbbbb-0000-0000-0000-000000000001'), 0);
select assert_equals('client cannot read other client messages',
  (select count(*)::int from messages where client_id = '22222222-2222-2222-2222-222222222222'), 0);
rollback;

-- ---------------------------------------------------------------------------
-- Privilege escalation attempts
-- ---------------------------------------------------------------------------

begin;
select login_as('00000000-0000-0000-0000-0000000000b1');

select assert_denied('client cannot promote self to admin',
  $$update profiles set role = 'admin' where id = auth.uid()$$);
select assert_denied('client cannot repoint own client_id at another tenant',
  $$update profiles set client_id = '22222222-2222-2222-2222-222222222222' where id = auth.uid()$$);
select assert_denied('client cannot create a client record',
  $$insert into clients (business_name) values ('Fake Co')$$);
select assert_denied('client cannot create a project',
  $$insert into projects (client_id, name) values ('11111111-1111-1111-1111-111111111111', 'Self serve')$$);
select assert_denied('client cannot edit update text',
  $$update updates set body = 'hacked' where id = 'aaaaaaaa-0000-0000-0000-000000000011'$$);
select assert_denied('client cannot mark own update done',
  $$update updates set done = true where id = 'aaaaaaaa-0000-0000-0000-000000000011'$$);
select assert_denied('client cannot edit message body',
  $$update messages set body = 'rewritten' where client_id = '11111111-1111-1111-1111-111111111111'$$);
select assert_denied('client cannot forge a message into another tenant',
  $$insert into messages (client_id, body) values ('22222222-2222-2222-2222-222222222222', 'injected')$$);
select assert_denied('client cannot insert a lead directly',
  $$insert into leads (name, email, message) values ('x', 'x@y.z', 'spam')$$);
select assert_no_rows_affected('client cannot delete own project',
  $$delete from projects where client_id = '11111111-1111-1111-1111-111111111111'$$);
select assert_no_rows_affected('client cannot upgrade care plan themselves',
  $$update care_plans set plan = 'Free forever' where client_id = '11111111-1111-1111-1111-111111111111'$$);
select assert_no_rows_affected('client cannot delete another tenant''s files',
  $$delete from files where client_id = '22222222-2222-2222-2222-222222222222'$$);
select assert_no_rows_affected('client cannot mark another tenant''s messages read',
  $$update messages set read_at = now() where client_id = '22222222-2222-2222-2222-222222222222'$$);
select assert_no_rows_affected('client cannot rename another tenant''s business',
  $$update clients set business_name = 'Owned' where id = '22222222-2222-2222-2222-222222222222'$$);

-- Confirm the blocked writes above left the other tenant untouched.
rollback;

begin;
select login_as('00000000-0000-0000-0000-0000000000c1');
select assert_equals('other tenant business name is intact',
  (select business_name from clients where id = '22222222-2222-2222-2222-222222222222'),
  'Harbor Dental');
select assert_equals('other tenant files are intact',
  (select count(*)::int from files), 1);
rollback;

-- ---------------------------------------------------------------------------
-- Permitted client writes
-- ---------------------------------------------------------------------------

begin;
select login_as('00000000-0000-0000-0000-0000000000b1');

insert into messages (client_id, body, service_id)
  values ('11111111-1111-1111-1111-111111111111', 'Can we add SEO?', 'seo');

select assert_equals('client message is attributed to the sender',
  (select sender_id from messages where body = 'Can we add SEO?'),
  '00000000-0000-0000-0000-0000000000b1'::uuid);
select assert_equals('client message cannot claim to be from admin',
  (select from_admin from messages where body = 'Can we add SEO?'), false);

update updates set acknowledged_at = now()
  where id = 'aaaaaaaa-0000-0000-0000-000000000011';
select assert_equals('client can acknowledge own update',
  (select acknowledged_at is not null from updates where id = 'aaaaaaaa-0000-0000-0000-000000000011'),
  true);

update messages set read_at = now() where client_id = '11111111-1111-1111-1111-111111111111';
select assert_equals('client can mark messages read',
  (select count(*)::int from messages where client_id = '11111111-1111-1111-1111-111111111111' and read_at is null),
  0);
rollback;

-- ---------------------------------------------------------------------------
-- from_admin forgery: a client cannot impersonate DasDev even by setting it
-- ---------------------------------------------------------------------------

begin;
select login_as('00000000-0000-0000-0000-0000000000b1');
insert into messages (client_id, body, from_admin)
  values ('11111111-1111-1111-1111-111111111111', 'trust me', true);
select assert_equals('from_admin is overridden by trigger, not trusted from input',
  (select from_admin from messages where body = 'trust me'), false);
rollback;

-- ---------------------------------------------------------------------------
-- Pending user (self-signup) is fully walled off
-- ---------------------------------------------------------------------------

begin;
select login_as('00000000-0000-0000-0000-0000000000d1');

select assert_equals('pending user sees no clients',
  (select count(*)::int from clients), 0);
select assert_equals('pending user sees no projects',
  (select count(*)::int from projects), 0);
select assert_equals('pending user sees no messages',
  (select count(*)::int from messages), 0);
select assert_equals('pending user sees no files',
  (select count(*)::int from files), 0);
select assert_equals('pending user sees own profile only',
  (select count(*)::int from profiles), 1);
select assert_equals('pending user role is pending',
  (select role::text from profiles), 'pending');

select assert_denied('pending user cannot post into a client thread',
  $$insert into messages (client_id, body) values ('11111111-1111-1111-1111-111111111111', 'let me in')$$);

insert into access_requests (user_id, business_name, message)
  values (auth.uid(), 'Stranger Co', 'Please give me access');
select assert_equals('pending user can file an access request',
  (select count(*)::int from access_requests), 1);
select assert_no_rows_affected('pending user cannot approve their own request',
  $$update access_requests set status = 'approved' where user_id = auth.uid()$$);
select assert_no_rows_affected('pending user cannot file a request for someone else',
  $$update access_requests set user_id = '00000000-0000-0000-0000-0000000000b1' where user_id = auth.uid()$$);
rollback;

-- ---------------------------------------------------------------------------
-- Admin has full reach
-- ---------------------------------------------------------------------------

begin;
select login_as('00000000-0000-0000-0000-0000000000a1');

select assert_equals('admin sees all clients', (select count(*)::int from clients), 2);
select assert_equals('admin sees all projects', (select count(*)::int from projects), 2);
select assert_equals('admin sees all messages', (select count(*)::int from messages), 2);
select assert_equals('admin sees all profiles', (select count(*)::int from profiles), 4);
select assert_equals('admin sees leads', (select count(*)::int from leads), 1);
select assert_equals('admin sees all files', (select count(*)::int from files), 2);

insert into clients (business_name, industry) values ('New Client Co', 'Retail');
select assert_equals('admin can create a client', (select count(*)::int from clients), 3);

insert into projects (client_id, name) values ('11111111-1111-1111-1111-111111111111', 'Phase 2');
select assert_equals('admin can create a project',
  (select count(*)::int from projects where client_id = '11111111-1111-1111-1111-111111111111'), 2);

update updates set body = 'Approve revised hero copy', done = true
  where id = 'aaaaaaaa-0000-0000-0000-000000000011';
select assert_equals('admin can edit an update',
  (select done from updates where id = 'aaaaaaaa-0000-0000-0000-000000000011'), true);

insert into messages (client_id, body) values ('11111111-1111-1111-1111-111111111111', 'Status update');
select assert_equals('admin message is flagged from_admin',
  (select from_admin from messages where body = 'Status update'), true);

update profiles set role = 'client', client_id = '11111111-1111-1111-1111-111111111111'
  where id = '00000000-0000-0000-0000-0000000000d1';
select assert_equals('admin can provision a pending user',
  (select role::text from profiles where id = '00000000-0000-0000-0000-0000000000d1'), 'client');
rollback;

-- ---------------------------------------------------------------------------
-- Data integrity constraints
-- ---------------------------------------------------------------------------

begin;
select assert_denied('a client role must have a client_id',
  $$update profiles set role = 'client', client_id = null where id = '00000000-0000-0000-0000-0000000000d1'$$);
select assert_denied('an admin must not be scoped to one client',
  $$update profiles set role = 'admin', client_id = '11111111-1111-1111-1111-111111111111' where id = '00000000-0000-0000-0000-0000000000a1'$$);
select assert_denied('a message body cannot be blank',
  $$insert into messages (client_id, body) values ('11111111-1111-1111-1111-111111111111', '   ')$$);
rollback;

\echo ''
\echo 'All RLS assertions passed.'
