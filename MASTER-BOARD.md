# MASTER BOARD — Das / Arriq
## Living Document | Updated: August 5, 2026
## One doc to rule them all. Edit this. Reference this. Don't let plans scatter.

---

## AT A GLANCE — CURRENT STATE

| Area | Status | Blocker | Notes |
|------|--------|---------|-------|
| **Portfolio** | V5 live at dasdev.net | Needs real projects + blog | Motion half-done |
| **Client Dashboard** | UI done, Supabase connected | Needs real clients | PIN auth works |
| **Homelab** | 20+ containers, stable | Some need config polish | Caddy + Tunnel working |
| **Finn / Hermes** | Humanize running, 4 crons active | Needs re-edit (Phase 2) | Model footer bug |
| **Agent-Reach** | 5/15 channels up | Twitter/Reddit need cookies | YouTube + RSS + web ready |
| **Income / Leads** | 15 leads compiled, some contacted | No sustained outreach | LeadFinder built |
| **Obsidian AI** | CouchDB, Ollama, Qdrant live | Needs daily use habit | Enhancer built |
| **AFFiNE** | Up at affine.dasdev.net | Need to verify workspace + copilot | SMTP + BYOK configured |
| **Penpot** | Fixed, all healthy | None ✅ | Ready for design work |
| **School** | Starts Aug 11 | — | 6 days left |

---

## ACTIVE — Working On Right Now

### A1. Fix Agent-Reach (In Progress)
**Goal:** Get Twitter/X and Reddit search working so Finn can do social research natively
- [x] Re-install agent-reach (latest from git)
- [x] Fix yt-dlp JS runtime config
- [ ] Export Twitter cookies from browser → `agent-reach configure twitter-cookies "..."`
- [ ] Export Reddit cookies → `agent-reach configure reddit-cookies "..."`
- [ ] Test: `agent-reach search-twitter "web design"`
- [ ] Optional: install mcporter + Exa for semantic search

**Why it matters:** Zero-API-cost research. Finn can monitor trends, find leads, research competitors.

**ETA:** 20 min when you're back (just need cookie export)

---

### A2. Unified Productivity Stack (This Session)
**Goal:** Consolidate scattered plans into one system: AFFiNE + Calendar + Routine
- [x] Fix Penpot (done — all containers healthy)
- [ ] Verify AFFiNE workspace exists, test copilot
- [ ] Build school schedule + daily routine doc
- [ ] Set up calendar system (Google Calendar or AFFiNE calendar)
- [ ] Create weekly rhythm / time blocks

**Why it matters:** School starts in 6 days. You need a system, not more tools.

**ETA:** 1-2 hours

---

### A3. Finn Health + Reliability
**Goal:** Finn fixes Finn. Stop manual gateway restarts.
- [ ] Restart gateway to activate webhooks (`systemctl --user restart hermes-gateway`)
- [ ] Set fallback provider (so Finn never goes silent)
- [ ] Fix model router display bug (cosmetic but annoying)
- [ ] Build "Finn health check" cron — self-diagnose and alert

**Why it matters:** You shouldn't have to babysit me.

**ETA:** 30 min

---

## BACKLOG — Next Up After Active

### B1. Portfolio That Converts
- Add 2-3 real projects (even personal experiments)
- Fix mobile nav + contact form backend
- Add blog section — "How I Built My Homelab" as first post
- SEO for "web design Largo"
- Motion polish (spring physics, custom cursor)

**Priority:** HIGH — this is your storefront

---

### B2. Automated Income Pipeline
- Contact top 5 leads (Pack o' Jacks, Hobson, Yeti, 727 Mobile, Largo Auto)
- Set up monthly lead scout cron
- Build "review link" system — send prospects a mockup of their new site
- Add every lead to dashboard with status tracking

**Priority:** HIGH — school starts soon, this needs to run itself

---

### B3. Creative Project (Twitter Growth)
**Pick one and commit:**
1. **"Site Autopsy"** — weekly thread roasting a local biz site + showing rebuild
2. **Creative Coding Friday** — generative art piece (WebGL, p5.js, ASCII)
3. **Homelab Dashboard as a Service** — open-source your homepage config

**Recommended:** #1 + #2 combo. Tue = Site Autopsy, Fri = Creative Coding. 2 posts/week.

**Priority:** MEDIUM — builds long-term following

---

### B4. Humanize Re-Edit (Phase 2)
- Review delay/reaction settings
- Adjust no-response rate
- Tune sleep schedule
- Check life events feel natural

**Priority:** MEDIUM — you're already good, this makes you great

---

## BLOCKED — Waiting On Something

| Blocker | What It's Blocking | What You Need To Do |
|---------|-------------------|---------------------|
| Twitter/Reddit cookies | Agent-Reach social search | Export from browser, run configure commands |
| Gateway restart | Webhooks go live | Run `systemctl --user restart hermes-gateway` |
| Fallback provider | Finn reliability if ollama-cloud down | Pick backup model, set in config |
| Raspberry Pis | Smart home, Home Assistant | Order when ready (later) |
| Legit Apple HW ID | BlueBubbles iMessage | Later — not needed rn |

---

## DONE — Recently Completed

- [x] Portfolio v5 live at dasdev.net
- [x] Client dashboard with Supabase auth + PIN activation
- [x] Homelab stack stable (Caddy, AdGuard, Vaultwarden, ntfy, etc.)
- [x] Humanize plugin Phase 1
- [x] Discord fixed (no threads, proper tone)
- [x] Model router + dynamic tool loading
- [x] 4 cron check-in jobs
- [x] LeadFinder + Cron + Proposal Writer
- [x] 15 local lead list compiled
- [x] Outreach texts drafted + some sent
- [x] Obsidian AI stack deployed (CouchDB, Ollama, Qdrant)
- [x] ntfy push notifications working
- [x] MCP servers (GitHub 26 tools, Filesystem 14 tools)
- [x] Webhooks configured (GitHub issues + PRs)
- [x] AFFiNE deployed with SMTP + copilot BYOK
- [x] Penpot fixed (secret-key + env vars)
- [x] Agent-Reach re-installed, 5/15 channels up

---

## QUICK WINS — Do These Today (Under 30 Min Each)

1. **Export Twitter cookies** → configure agent-reach → test search
2. **Restart Hermes gateway** → webhooks go live
3. **Check AFFiNE workspace** → create one if empty → test copilot
4. **Set fallback provider** → pick backup model in config
5. **Send 1 lead text** — just one, any of the top 5

---

## SCHOOL SCHEDULE + DAILY ROUTINE

### When School Starts (Aug 11)

| Time Block | Activity | Where |
|------------|----------|-------|
| 6:30 AM | Wake up, check phone | Bed |
| 6:45 AM | Shower + get ready | Bathroom |
| 7:15 AM | Breakfast + check AFFiNE calendar | Kitchen |
| 7:45 AM | Leave for school | Car |
| 8:30-3:00 PM | School | Largo High |
| 3:30 PM | Home, snack, decompress | Home |
| 4:00-6:00 PM | **Deep Work Block** — portfolio, leads, or creative project | Desk |
| 6:00 PM | Dinner | Kitchen |
| 7:00-9:00 PM | **Light Work / Homework** — math, etc. | Desk |
| 9:00-10:00 PM | Chill — Minecraft, music, homelab tinkering | Anywhere |
| 10:00 PM | Start winding down | Bed |
| 11:00 PM | Sleep target | Bed |

### Deep Work Rules
- Phone in another room or face-down
- One task only — no context switching
- 50 min work / 10 min break (Pomodoro)
- Finn check-ins at 4pm and 9pm

### Weekend Rhythm
| Day | Focus |
|-----|-------|
| Saturday AM | Homelab projects, new deployments |
| Saturday PM | Creative coding or portfolio work |
| Sunday AM | Lead follow-ups, outreach |
| Sunday PM | Plan next week in AFFiNE, review board |

---

## TOOL INVENTORY — What We Have Where

| Tool | URL / Path | Status | Purpose |
|------|-----------|--------|---------|
| Portfolio | https://dasdev.net | Live | Client storefront |
| AFFiNE | https://affine.dasdev.net | Live | Notes, docs, planning |
| Penpot | https://penpot.dasdev.net | Fixed ✅ | UI/UX design |
| Homepage | https://home.dasdev.net | Live | Homelab dashboard |
| Filebrowser | https://files.dasdev.net | Live | File manager |
| Vaultwarden | https://vault.dasdev.net | Live | Password manager |
| ntfy | https://notify.dasdev.net | Live | Push notifications |
| searxng | https://search.dasdev.net | Live | Private search |
| Beszel | https://beszel.dasdev.net | Live | Server monitoring |
| Uptime Kuma | https://status.dasdev.net | Live | Uptime monitoring |
| AdGuard | https://dns.dasdev.net | Live | DNS filtering |
| Termix | https://termix.dasdev.net | Live | Browser terminal |
| Cobalt | https://cobalt.dasdev.net | Live | Media downloader |
| Dockge | https://dockge.dasdev.net | Live | Container manager |
| Obsidian Sync | https://obsidian-sync.dasdev.net | Live | Note sync |
| Finn (Hermes) | Discord / CLI | Active | AI assistant |
| Agent-Reach | `/home/das/agents/agent-reach` | 5/15 up | Social/web research |
| LeadFinder | `/home/das/projects/leadfinder` | Built | Lead scouting |

---

## DOCUMENT INVENTORY — All Your Docs

| Document | Location | Status |
|----------|----------|--------|
| This board (master) | `/home/das/MASTER-BOARD.md` | **LIVE** |
| Execution Plan | `/home/das/MASTER-EXECUTION-PLAN.md` | Reference |
| Automation Master | `/home/das/MASTER-AUTOMATION-DOC.md` | Reference |
| Workflow Document | `/home/das/THE-ULTIMATE-WORKFLOW-DOCUMENT.md` | Reference |
| Creative Projects | `/home/das/CREATIVE-PROJECTS-PLAN.md` | Reference |
| Finn Workspace Plan | `/home/das/FINN-WORKSPACE-PLAN.md` | Future |
| Local Business Leads | `/home/das/LOCAL-BUSINESS-LEADS-JULY-2026.md` | Use it |
| Cold Call Script | `/home/das/COLD-CALL-SCRIPT.md` | Use it |
| X Bookmarks Arsenal | `/home/das/x-bookmarks-arsenal-v2.md` | Reference |
| Minecraft Plugins | `/home/das/minecraft-plugins-guide.md` | Reference |
| Homelab Master Plan | `/home/das/hermes-plans/das-homelab-master-plan.md` | Reference |
| Finn Upgrade Plan | `/home/das/hermes-plans/finn-upgrade-execution-plan-v2.md` | Reference |

---

## WHAT TO IGNORE (For Now)

- BlueBubbles (no Mac hardware)
- Smart Home / Raspberry Pi (cool but needs hardware)
- Multi-profile Hermes gateways (advanced, not needed)
- Grafana/Prometheus (Beszel is enough)
- Full backup solution (restic/B2 — do after school starts)

---

## NEXT ACTIONS (When You Get Back)

1. **Read this board** — scratch out what changed, add whatever
2. **Pick ONE active item** — lock in for 1 hour minimum
3. **Export Twitter cookies** → run agent-reach configure
4. **Check AFFiNE** — log in, verify workspace, test copilot
5. **Set your fallback provider** — so Finn never goes silent

---

*This doc lives at `/home/das/MASTER-BOARD.md`. Edit it anytime. Tell me what changed.*
