-- Column-level write guards.
--
-- A Postgres UPDATE policy can only decide whether a row may be updated; it
-- cannot restrict which columns change. Where a client is allowed to touch a
-- row at all, these triggers pin down exactly which field may move.

-- Clients may acknowledge an update item. Everything else on the row belongs to
-- DasDev: without this, updates_client_acknowledge would let a client rewrite
-- the item text or tick it done.
create or replace function public.guard_update_columns()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.is_privileged() then
    return new;
  end if;

  if new.id is distinct from old.id
    or new.project_id is distinct from old.project_id
    or new.body is distinct from old.body
    or new.done is distinct from old.done
    or new.due_date is distinct from old.due_date
    or new.created_by is distinct from old.created_by
    or new.created_at is distinct from old.created_at
  then
    raise exception 'clients may only acknowledge an update';
  end if;

  return new;
end;
$$;

create trigger updates_guard_columns before update on updates
  for each row execute function public.guard_update_columns();

-- A message thread is a record of what was said. Neither side may edit or
-- reassign a message; the only mutable field is the read receipt.
create or replace function public.guard_message_columns()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.id is distinct from old.id
    or new.client_id is distinct from old.client_id
    or new.sender_id is distinct from old.sender_id
    or new.from_admin is distinct from old.from_admin
    or new.body is distinct from old.body
    or new.service_id is distinct from old.service_id
    or new.created_at is distinct from old.created_at
  then
    raise exception 'messages are immutable except for read_at';
  end if;

  return new;
end;
$$;

create trigger messages_guard_columns before update on messages
  for each row execute function public.guard_message_columns();

-- An access request is a claim the reviewer acts on. The requester must not be
-- able to approve their own request.
create or replace function public.guard_access_request_columns()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_privileged() then
    raise exception 'only an admin may review an access request';
  end if;

  if new.user_id is distinct from old.user_id then
    raise exception 'access request cannot be reassigned';
  end if;

  return new;
end;
$$;

create trigger access_requests_guard_columns before update on access_requests
  for each row execute function public.guard_access_request_columns();
