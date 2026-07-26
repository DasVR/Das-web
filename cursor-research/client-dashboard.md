# Client Dashboard — Product Research

Updated: 2026-07-26  
Status: Active — guides `/dashboard` scaffold and services expansion

---

## Why this exists

Marketing site wins the client. The **client dashboard** keeps them:

- See project status without emailing for updates
- Approve open items (copy, brand options, launch checks)
- Understand which services they are on
- Request more work from a **broad** service menu
- Stay on Maintenance / Care after launch

Aligns with north star in `personal-portfolio-direction.md`: personal brand + hireable SMB work across many industries — not trades-only.

---

## Constraints (current deploy)

| Fact | Implication |
|------|-------------|
| `output: 'export'` → nginx static | No Next.js API routes / server sessions on this host |
| Demo gate today | `localStorage` access key — **prototype only** |
| Contact already third-party | Formspree / mailto pattern for inquiries |

**Path forward for production auth:** keep marketing static; put real portal on subdomain/app with Clerk/Auth.js + Supabase (or similar), **or** relax static export for the portal only.

Do not put real secrets or client PII in static JS.

---

## Personas

1. **Active project client** — wants status, open approvals, next milestone  
2. **Care / retainer client** — wants “is my site ok?” + easy tweak requests  
3. **Multi-service client** — brand + site + landing + SEO over time  
4. **Arriq (operator)** — later: multi-client admin; out of MVP scope for the client-facing UI

---

## MVP screens (scaffold now)

| Screen | Job |
|--------|-----|
| `/dashboard/login` | Access key (later: email + invite) |
| `/dashboard` | Workspace home: stats, projects, updates, care, browse more services |
| (later) Project detail | Files, timeline, comments |
| (later) Request change | Structured request → email/ticket |

**Not in first viewport of marketing site.** Portal is a product surface — strip marketing nav chrome on `/dashboard/*`, `noindex`.

---

## Data model (client workspace)

```
ClientWorkspace
  businessName, industry, since
  projects[] → status, url, services[], note
  updates[] → open / done checklist
  care → plan, renews, included[]
  engagedServices[] → ServiceId[]
```

Services live in `src/lib/services.ts` (shared with marketing accordion).

---

## Broad services commitment

Positioning already says **many industries**. The catalog must match:

**Build:** Web Design, Branding, Development, Landing Pages, UI/Product, E-commerce Lite  
**Grow:** SEO, Content & Copy  
**Care:** Hosting & Launch, Maintenance  
**Special:** Strategy Session, Creative Direction  

Industries to support in copy + demo data (not niche-lock):

- Professional services, retail/makers, hospitality, creators/studios  
- Trades (welcome, not the whole story), clinics, coaches, early startups  

Pricing stays approachable ($500–$1,500+ typical projects; Maintenance $50/mo).

---

## Auth roadmap

1. **Now:** Demo key + sample workspace (Northline Studio)  
2. **Next:** Per-client invite codes hashed server-side; session cookies  
3. **Later:** Magic link / email OTP; Arriq admin to provision workspaces  

Never ship “any non-empty password” to real clients.

---

## Success check

- A coach, a cafe, and a plumber could each log in and the UI still makes sense  
- Service list on marketing matches what clients can browse in the portal  
- Portal does not look like a marketing dashboard (one composition, clear status job)  
- Static export still builds; real secrets stay off this repo’s client bundle  

---

## Related research

- `personal-portfolio-direction.md` — broad SMB north star  
- `business-info.txt` — contact + price band  
- `v4-broad-inspiration-2026.md` — service framing  
- `v5-massive-site-inspo-and-architecture.md` — site IA (portal is additive)  
