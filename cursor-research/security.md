# DasDev Security Model

Updated: 2026-07-27  
Status: Active — documents the live threat model, key handling, and rotation
runbook for the static marketing site plus the Supabase-backed portal.

Related: `supabase/README.md` (schema / RLS / Edge Functions),
`nginx/security-headers.conf`, `nginx/private-headers.conf`, `webhook-server.py`.

---

## Architecture in one paragraph

`dasdev.net` is a Next.js static export served by nginx behind Caddy. There is
no application server and no Next.js middleware. Auth, Postgres, Storage, and
privileged writes live in Supabase. The browser holds only the anon key; the
`service_role` key exists only inside Edge Function secrets. **Row Level
Security is the security boundary**, not the fact that a route is unlinked or a
UI element is hidden.

```
Browser ──► nginx + Caddy (static HTML/JS, CSP, HSTS)
         ──► Supabase Auth / PostgREST / Storage  (anon key + user JWT)
         ──► Edge Functions                       (JWT checked, then service_role)
GitHub Actions ──HMAC──► webhook.dasdev.net ──► deploy.sh
```

---

## Threat model

| Threat | What an attacker can do | Mitigation |
|--------|-------------------------|------------|
| Read the static JS bundle | Recover the anon key, every route, every query shape | Expected. Anon key grants nothing without a session; RLS default-deny on every table. |
| Forge a session | Impersonate a client or admin | Supabase issues JWTs; Edge Functions call `auth.getUser(token)`, never trust the body. |
| Cross-tenant read/write | Client A reads Client B's projects, messages, files | RLS policies scope every row to `current_client_id()` or `is_admin()`. Covered by `supabase/tests/rls_test.sql`. |
| Privilege escalation via profile update | Client sets `role = 'admin'` or repoints `client_id` | `guard_profile_privileges` trigger blocks column changes unless `is_privileged()`. |
| Edit protected columns through a allowed UPDATE | Client rewrites update text / marks done / edits message body | Column-guard triggers in `0003_column_guards.sql`. |
| Direct insert into `leads` | Spam the leads table without captcha | No INSERT policy for authenticated/anon; only `submit-lead` Edge Function (service_role) inserts after Turnstile. |
| Call an Edge Function from a foreign origin | Use the functions as an open relay | CORS allow-list echoes only `dasdev.net` / `www` / localhost; never reflects arbitrary Origin. |
| Capture a deploy webhook and replay it | Trigger `git pull` + `docker build` on the VPS | HMAC-SHA256 over the raw body + 5-minute timestamp window. Old shared-token is gone. |
| Replay an old signed deploy body | Re-fire a previous successful deploy | Timestamp skew check (`MAX_SKEW_SECONDS = 300`). |
| Clickjack the portal | Overlay `/dashboard` or `/admin` in an iframe | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`. |
| Cache a signed-in portal page | Shared proxy serves stale session shell | `Cache-Control: no-store` + `X-Robots-Tag: noindex` on `/dashboard` and `/admin`. |
| Index portal URLs | Search engines list `/dashboard`, `/admin` | `robots.txt` Disallow + page `noindex` metadata + nginx `X-Robots-Tag`. |
| XSS via inline script | Inject into the static export | CSP locks `object-src`, `base-uri`, `frame-ancestors`. `'unsafe-inline'` is required for Next hydration and framer-motion; nonce CSP is impossible without a server. |
| Exfiltrate Storage files | Guess object paths in `client-files` | Bucket is private; clients only see objects under their `client_id/` prefix via Storage RLS; downloads use signed URLs. |
| Leak secrets through git | Commit `.env`, tokens, service_role | `.gitignore` covers `.env` and `.env.*`. Deploy secret lives in the systemd unit / GitHub Actions secret only. History still holds the old plaintext token — rotation is mandatory (see below). |

Out of scope for this document: host compromise of the VPS, Supabase platform incidents, and physical access. Those are owned by the hosting providers' own controls.

---

## Key inventory

| Secret | Where it lives | Who may see it | Rotation |
|--------|----------------|----------------|----------|
| `DEPLOY_SECRET` | Server env (systemd / env file outside the repo) + GitHub Actions `secrets.DEPLOY_SECRET` | Deploy webhook + CI only | Anytime; update both sides in the same window |
| `NEXT_PUBLIC_SUPABASE_URL` | Build-time env / CI | Public (bundle) | Project rebuild |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build-time env / CI | Public (bundle) | Rotate in Supabase dashboard; rebuild site |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function secrets only | Edge runtime | Rotate in Supabase; redeploy functions |
| `RESEND_API_KEY` | Edge Function secrets | Edge runtime | Rotate in Resend dashboard |
| `RESEND_FROM` | Edge Function secrets | Edge runtime | DNS/domain change |
| `TURNSTILE_SECRET_KEY` | Edge Function secrets | Edge runtime | Rotate in Cloudflare |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build-time env | Public (bundle) | Paired with secret rotation |
| `ADMIN_NOTIFY_EMAIL` | Edge Function secrets | Edge runtime | Config change |

Never put `SUPABASE_SERVICE_ROLE_KEY`, `DEPLOY_SECRET`, `RESEND_API_KEY`, or
`TURNSTILE_SECRET_KEY` in `NEXT_PUBLIC_*` variables, the static export, or a
committed file.

---

## What the browser is allowed to do

Client session (role `client`, linked `client_id`):

- Read own client, projects, updates, care plan, messages, files
- Insert messages into own thread (sender forced by trigger; `from_admin` cannot be forged)
- Acknowledge own updates (`acknowledged_at` only)
- Mark own inbound messages read (`read_at` only)
- Request signed URLs for own Storage objects

Pending session (signed up, not yet linked):

- Read own profile
- Insert an `access_requests` row for themselves
- See nothing else

Admin session:

- Full read/write via RLS admin branch
- Call `invite-client`, `send-message`, `notify-update` Edge Functions

Unauthenticated:

- Marketing pages only
- `submit-lead` Edge Function (Turnstile required when configured)

UI redirects in `useRequireAuth` are convenience only. An unauthorised session
that reached `/admin` anyway would render empty because every admin query is
still filtered by RLS.

---

## Deploy webhook

`webhook-server.py` refuses to start without `DEPLOY_SECRET`. Auth is:

1. HMAC-SHA256 of the **raw request body** using `DEPLOY_SECRET`
2. Constant-time compare against `X-Deploy-Signature`
3. Body timestamp within ±5 minutes of server time

Verified locally:

| Case | Result |
|------|--------|
| Valid signature + fresh timestamp | `202` and deploy runs |
| Missing / wrong signature | `403` |
| Valid signature over a different body | `403` |
| Timestamp older than 5 minutes | `403` |
| Wrong path | `404` |
| No `DEPLOY_SECRET` in env | Process exits before listening |

GitHub Actions (`.github/workflows/deploy.yml`) builds the body, signs it with
`openssl dgst -sha256 -hmac`, and posts to `https://webhook.dasdev.net/deploy`.

---

## HTTP surface (nginx)

Public routes (`/` and friends):

- CSP, HSTS (2 years, includeSubDomains, preload), `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP, CORP
- HTML: `Cache-Control: public, max-age=0, must-revalidate`
- `/_next/static`: `immutable`, 1 year
- Real `404` via `error_page` (no soft-404 home shell)

Portal routes (`/dashboard`, `/admin`):

- Same CSP/HSTS family
- `Cache-Control: no-store`
- `X-Robots-Tag: noindex, nofollow, noarchive`
- Stricter Referrer-Policy (`strict-origin`)

Canonical URLs:

- Client requests for `*.html` / `index.html` 301 to the clean path, keyed on
  `$request_uri` so internal `index` / `try_files` rewrites cannot loop
- Per-page `<link rel="canonical">` from `pageMetadata()`; sitemap lists only
  public marketing routes

---

## Rotation runbook

### 1. Deploy secret (do this if the old token was ever public)

The previous plaintext token (`das-web-autodeploy-2026`) lived in git history.
Assume it is known. Rotate even if nothing has been observed.

```bash
# On the VPS
NEW=$(openssl rand -hex 32)
# Put NEW into the systemd unit / env file that launches webhook-server.py
# then restart the webhook service.

# In GitHub → Settings → Secrets → Actions
# Update DEPLOY_SECRET to the same value.
```

Confirm by pushing to `master` (or `workflow_dispatch`) and checking the deploy
log. An old Actions secret produces `403` on the webhook.

### 2. Supabase service_role / anon keys

1. Supabase Dashboard → Project Settings → API → Reset
2. Update Edge Function secrets (`supabase secrets set …`)
3. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the build environment
4. Redeploy Edge Functions and rebuild/redeploy the static site

Anon-key rotation alone is low urgency (public by design). Service-role
rotation is urgent if the key ever left an Edge Function secret.

### 3. Resend / Turnstile

Rotate in the provider dashboard, then:

```bash
supabase secrets set RESEND_API_KEY=... TURNSTILE_SECRET_KEY=...
# Rebuild the site if the Turnstile site key changed.
```

### 4. Compromised admin account

```sql
-- Revoke immediately
update profiles set role = 'pending', client_id = null
where id = '<compromised-user-id>';

-- Then sign the user out from Supabase Auth dashboard (or auth.admin.signOut).
```

Promote a replacement admin from the SQL editor (trusted connection):

```sql
update profiles set role = 'admin', client_id = null
where id = (select id from auth.users where email = 'hello@dasdev.net');
```

### 5. Suspected cross-tenant leak

1. Freeze writes: set affected clients' status / revoke sessions
2. Re-run `bash supabase/tests/run-rls-tests.sh` against a restored snapshot
   of the schema (policies must still pass)
3. Diff `supabase/migrations/` against `master` for accidental policy opens
4. Rotate service_role if any Edge Function log shows unexpected callers

---

## Verification checklist

Run after any security-touching change:

```bash
# RLS regression (56 assertions, each phrased as an attack)
bash supabase/tests/run-rls-tests.sh

# Edge Function types (Deno)
cd supabase/functions && deno check \
  invite-client/index.ts send-message/index.ts \
  notify-update/index.ts submit-lead/index.ts

# Webhook: starts only with DEPLOY_SECRET; rejects unsigned / replayed bodies
# (see webhook-server.py header comment)

# nginx headers / redirects (against a local build of dist/)
# /dashboard and /admin → no-store + X-Robots-Tag
# /*.html → 301 to clean path
# /nope → real 404
```

Auth settings to keep on in the Supabase dashboard (not enforceable from this
repo): email confirmation required, leaked-password protection on, minimum
password length ≥ 10.

---

## Explicit non-goals

- Hiding `/admin` or `/dashboard` by obscurity — routes are public static
  files; access is enforced in Postgres.
- Nonce-based CSP — static export cannot mint a per-request nonce.
- Putting portal auth cookies on dasdev.net — there is no Next.js server to
  set or verify them; Supabase owns the session.
