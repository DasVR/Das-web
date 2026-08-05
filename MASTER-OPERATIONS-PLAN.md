# MASTER OPERATIONS PLAN — Das / Arriq
## Single Source of Truth | Updated: August 5, 2026
### "Lock tf in twin, we're building" — Finn

---

## DAILY SCHEDULE (School Year — Sophomore)
**School starts: August 11, 2026**

| Time Block | Activity | Notes |
|------------|----------|-------|
| **6:30 AM** | Wake up | Check Finn messages / notifications |
| **7:00 AM** | Morning routine | Shower, get ready |
| **7:30 AM** | Breakfast + scroll | X feed, check bookmarks, brief Finn |
| **8:00 AM** | Commute / prep | School days only |
| **8:30–3:00 PM** | School | No distractions |
| **3:30 PM** | Home / wind down | 30min free |
| **4:00–5:30 PM** | **DEEP WORK BLOCK 1** | Portfolio, client work, coding |
| **5:30–6:30 PM** | Dinner / family | |
| **6:30–8:00 PM** | **DEEP WORK BLOCK 2** | Homelab, learning, side projects |
| **8:00–10:00 PM** | Chill / games / Minecraft | Unwind |
| **10:00 PM** | **Start winding down** | No screens ideally |
| **10:30 PM** | Sleep target | Aim for this, you know you push it lol |
| **12:00–2:00 AM** | ⚠️ DANGER ZONE | If you're here, something's wrong twin |

**Weekend adjustments:**
- Deep Work Block 1 moves to 10 AM–1 PM (sleep in)
- Deep Work Block 2: 2–5 PM
- Evening is free

---

## WEEKLY RHYTHM

| Day | Theme |
|-----|-------|
| **Monday** | Plan week, check all systems, review leads |
| **Tuesday** | Portfolio / creative work |
| **Wednesday** | Client work / outreach |
| **Thursday** | Learning / homelab projects |
| **Friday** | Wrap up, review week, set weekend goals |
| **Saturday** | Big project blocks, deep work |
| **Sunday** | Chill, prep for week, light maintenance |

---

## PRODUCTIVITY SYSTEMS

### 1. AFFiNE (Self-Hosted Notes + Docs)
**URL:** https://affine.dasdev.net
**Status:** ✅ Running, AI copilot configured, email configured
**Use for:**
- Daily journal / check-ins
- Project planning
- School notes (migrate from scattered docs)
- Research compilation
- Calendar / scheduling

**Next steps:**
- [ ] Create "School Notes" workspace
- [ ] Set up daily journal template
- [ ] Migrate key project docs from scattered files
- [ ] Configure calendar view for scheduling

---

### 2. Penpot (Design + Wireframes)
**URL:** https://penpot.dasdev.net
**Status:** ✅ Running, all containers healthy
**Use for:**
- Website wireframes before coding
- Client mockups
- Design exploration
- Portfolio asset creation

**Next steps:**
- [ ] Create portfolio page wireframes
- [ ] Design client dashboard mockup
- [ ] Explore design systems

---

### 3. Agent-Reach (Twitter/X Research Engine)
**Status:** ✅ FULLY OPERATIONAL — 6/15 channels up
**Backends:**
- twitter-hybrid (search via twscrape, actions via twitter-cli)
- Configured with your cookies

**Commands available:**
```bash
twitter-hybrid search "query" -n 20    # Search tweets
twitter-hybrid feed -n 20              # Your timeline
twitter-hybrid bookmarks -n 20        # Your bookmarks
twitter-hybrid user-posts user -n 20   # User's tweets
twitter-research design                  # Find design inspiration
twitter-research leads                   # Find freelance leads
twitter-research tech                    # Find tech news
twitter-research all                     # Run everything
```

**Use for:**
- Design inspiration research
- Finding freelance leads
- Tech news monitoring
- Content ideas for your X growth
- Bookmark curation

---

### 4. Obsidian AI System
**Components:**
- CouchDB sync ✅
- Ollama (local LLM) ✅
- Qdrant (vector search) ✅
- Search API (port 8093) ✅
- Enhancer ✅

**Use for:**
- Long-term knowledge storage
- AI-enhanced note-taking
- Research compilation
- Cross-referencing ideas

**Next step:** Build daily habit of adding 1 thing to vault

---

### 5. Uptime Kuma (Monitoring)
**URL:** https://status.dasdev.net
**Status:** ✅ Running, monitors configured
**Monitors:** Portfolio, AFFiNE, SearXNG, ntfy, Dockge, etc.

---

### 6. ntfy (Push Notifications)
**URL:** https://notify.dasdev.net
**Status:** ✅ Auth enabled, admin user `das`
**Use for:**
- System alerts
- Cron job notifications
- Custom pushes from scripts

---

## ACTIVE PROJECTS STATUS

### Portfolio v5
| Item | Status | Priority |
|------|--------|----------|
| Live at dasdev.net | ✅ Done | |
| Multi-page scaffold | ✅ Done | |
| Spring transitions | ✅ Done | |
| Mobile nav | ⚠️ Needs work | High |
| Contact form backend | ❌ Not done | High |
| Real projects showcased | ❌ Not done | Critical |
| SEO optimization | ❌ Not done | Medium |
| Blog section | ❌ Not done | Medium |

**Next action:** Add 2–3 real projects (even personal experiments)

---

### Client Dashboard
| Item | Status | Priority |
|------|--------|----------|
| UI built | ✅ Done | |
| Supabase auth | ✅ Done | |
| Review links | ✅ Done | |
| PIN activation | ✅ Done | |
| Real clients | ❌ None yet | Critical |

**Next action:** Land first client, onboard through dashboard

---

### Outreach / Income
| Item | Status | Priority |
|------|--------|----------|
| 15 local leads compiled | ✅ Done | |
| Outreach texts drafted | ✅ Done | |
| LeadFinder system | ✅ Done | |
| Proposal writer | ✅ Done | |
| Actually sent outreach | ⚠️ Partial | High |
| First client landed | ❌ Not yet | Critical |

**Next action:** Text top 5 leads this week

---

### Homelab Infrastructure
| Service | Status | URL |
|---------|--------|-----|
| Caddy reverse proxy | ✅ Running | localhost:80 |
| Cloudflare Tunnel | ✅ Routing | All subdomains |
| Tailscale VPN | ✅ Active | Remote access |
| AdGuard Home | ✅ Running | dns.dasdev.net |
| Vaultwarden | ✅ Running | vault.dasdev.net |
| Beszel monitoring | ✅ Running | beszel.dasdev.net |
| Uptime Kuma | ✅ Running | status.dasdev.net |
| ntfy | ✅ Running | notify.dasdev.net |
| Plex | ✅ Running | plex.dasdev.net |
| Firecrawl | ✅ Running | firecrawl.dasdev.net |
| Dockge | ✅ Running | dockge.dasdev.net |
| Filebrowser | ✅ Running | files.dasdev.net |
| Homepage | ✅ Running | home.dasdev.net |
| SearXNG | ✅ Running | search.dasdev.net |
| AFFiNE | ✅ Running | affine.dasdev.net |
| Penpot | ✅ Running | penpot.dasdev.net |
| Obsidian Sync | ✅ Running | obsidian-sync.dasdev.net |
| Webhook | ✅ Running | webhook.dasdev.net |

**Containers needing attention:**
- [ ] Homepage customization (still default)
- [ ] Connect orphaned services to proxy network
- [ ] Backup solution (restic or borg)

---

## FINN / HERMES SYSTEMS

| Feature | Status | Notes |
|---------|--------|-------|
| Humanize plugin | ✅ Phase 1 running | Needs tuning |
| Cron check-ins | ✅ 4 jobs active | 11am, 3pm, 9pm, random Tue/Fri |
| Memory (2-file + search) | ✅ Working | |
| Model router | ✅ Configured | Display bug (cosmetic) |
| MCP GitHub | ✅ 26 tools | |
| MCP Filesystem | ✅ 14 tools | |
| MCP Time | ❌ Removed | Compatibility issue |
| Webhooks | ✅ Configured | Needs gateway restart |
| Fallback provider | ❌ NOT SET | Critical — prevents silence |
| Goals /task persistence | ⚠️ Partial | Needs testing |

---

## AUGUST GOALS (Before School Starts)

### Week 1 (Aug 3–9)
- [ ] Add 2 real projects to portfolio
- [ ] Fix mobile nav
- [ ] Text 5 local leads
- [ ] Set up AFFiNE school workspace
- [ ] Configure fallback LLM provider
- [ ] Test persistent goals (`/goal` feature)

### Week 2 (Aug 10–16) — SCHOOL STARTS
- [ ] First week routine lock-in
- [ ] Portfolio contact form working
- [ ] At least 1 lead responded
- [ ] Daily AFFiNE journal habit started

### September
- [ ] First client project underway
- [ ] Portfolio SEO basics done
- [ ] Blog / writing section live (1 post)
- [ ] Humanize plugin Phase 2 (auto memory extraction)

---

## QUICK REFERENCE

### Important URLs
| Service | URL |
|---------|-----|
| Portfolio | https://dasdev.net |
| AFFiNE | https://affine.dasdev.net |
| Penpot | https://penpot.dasdev.net |
| Obsidian Sync | https://obsidian-sync.dasdev.net |
| Status | https://status.dasdev.net |
| Search | https://search.dasdev.net |
| Notifications | https://notify.dasdev.net |
| File Manager | https://files.dasdev.net |
| Docker Manager | https://dockge.dasdev.net |

### Key Commands
```bash
# Agent-Reach
twitter-hybrid search "query" -n 20
twitter-hybrid feed -n 10
twitter-research design

# Docker
docker ps                    # See all containers
docker compose up -d         # Start stack
docker logs <container>    # Check logs

# Hermes
hermes doctor              # Check Finn status
hermes mcp list            # List MCP servers
hermes cron list           # List cron jobs

# System
systemctl --user restart hermes-gateway    # Restart gateway
```

### Credentials Storage
- `~/.agent-reach/config.yaml` — Agent-Reach config
- `~/.hermes/.env` — Hermes secrets (git-ignored)
- `/opt/stacks/affine/.env` — AFFiNE secrets
- `/opt/stacks/penpot/compose.yml` — Penpot config
- `/etc/cloudflared/config.yml` — Tunnel config

---

## NOTES

- **This doc lives at:** `~/MASTER-OPERATIONS-PLAN.md`
- **Update it anytime** — tell me what changed and I'll sync it
- **Check in weekly** — Mondays at minimum
- **If something breaks:** Check status.dasdev.net first, then tell me
- **Your #1 priority before school:** Portfolio real projects + first client outreach
- **Sleep is non-negotiable** — deep work requires rest twin

---

*Last updated by Finn — August 5, 2026*
*Next review: Monday, August 11, 2026*
