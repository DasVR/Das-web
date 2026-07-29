-- Adds access_key to clients for PIN-based activation.
--
-- When an admin creates a client, an access key is generated so the contact can
-- self-activate without relying on Supabase Auth invite emails (which hit rate
-- limits). The key is cleared on first successful activation.

alter table clients
  add column access_key text,
  add column access_key_created_at timestamptz;

-- Fast lookup for the activation edge function.
create index clients_access_key_idx on clients (access_key) where access_key is not null;

-- Only admins should see access keys, but the edge function uses service_role
-- so no extra RLS changes are needed here.
