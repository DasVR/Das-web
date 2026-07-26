# DasDev portal backend

Auth, per-client data, and file delivery for `/dashboard` and `/admin`.

The marketing site stays a static export on nginx. The portal talks to Supabase
directly from the browser, so **Row Level Security is the security boundary** —
not the fact that a route is unlinked or a UI element is hidden. The anon key
ships in the JavaScript bundle by design; it is only safe because every table
denies by default.

## Layout

```
migrations/
  0001_init_schema.sql    tables, enums, indexes, helper functions, triggers
  0002_rls_policies.sql   RLS enable + force, per-table per-operation policies
  0003_column_guards.sql  column-level write guards (see note below)
  0004_storage.sql        private client-files bucket + object policies
functions/
  submit-lead/            contact form -> leads (verifies Turnstile)
  invite-client/          create client + invite user by email
  send-message/           admin message + email notification
  notify-update/          email a client when an update needs their attention
  _shared/lib.ts          auth, CORS, Turnstile, Resend, input validation
tests/
  run-rls-tests.sh        runs the suite against a throwaway local Postgres
  rls_test.sql            56 assertions, each phrased as an attack
  auth_stub.sql           local stand-ins for auth.users / auth.uid() / storage
```

## Why the column guards exist

A Postgres `UPDATE` policy decides *whether a row* may be updated. It cannot
restrict *which columns* change. Two places need that distinction:

- A client may acknowledge an update item, but must not rewrite its text or tick
  it done.
- Either party may mark a message read, but neither may edit the message body.

`0003_column_guards.sql` enforces those with `BEFORE UPDATE` triggers. Without
them, the permissive row policies would amount to full edit access.

The same reasoning applies to `profiles`: a client can update their own profile
row, so a trigger blocks changes to `role` and `client_id`. Otherwise any client
could promote themselves to admin.

## Running the tests

```bash
bash supabase/tests/run-rls-tests.sh
```

Requires a local PostgreSQL 16 (`apt-get install postgresql`). It boots a
temporary cluster, applies the stub plus every migration, and asserts tenant
isolation. Run it after any policy change.

The suite distinguishes the two ways Postgres refuses a write, because only one
of them raises:

- **Raises** when a policy admits the row but a guard trigger or check
  constraint rejects the change.
- **Zero rows affected** when RLS simply makes the rows invisible. An `UPDATE`
  or `DELETE` the caller is not entitled to succeeds while touching nothing.

Asserting only for exceptions would silently pass a real breach.

## Applying to a project

```bash
supabase link --project-ref <ref>
supabase db push
supabase functions deploy submit-lead invite-client send-message notify-update
```

See `cursor-research/security.md` for the threat model, key inventory, and
rotation runbook.

## Bootstrapping the first admin

Signup always lands as `pending`, and the privilege guard stops anyone promoting
themselves. Promote the first admin from the Supabase SQL editor, which runs as
a trusted connection:

```sql
update profiles set role = 'admin', client_id = null
where id = (select id from auth.users where email = 'hello@dasdev.net');
```

## Required configuration

Client bundle (safe to expose, must be prefixed `NEXT_PUBLIC_`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional; signup captcha)

Edge Function secrets (never exposed to the browser):

- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `ADMIN_NOTIFY_EMAIL`

Recommended Supabase Auth settings: require email confirmation, enable leaked
password protection, minimum password length 10.
