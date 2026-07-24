# Inspiration Research — Personal Portfolio + Broad SMB (2026)

Compiled for Arriq / Das Web Design — move beyond trade-only framing.

---

## North star vibe (unchanged craft, wider story)

Dark editorial · computational accents (dots, slash, mono) · cinematic motion · **personal voice** · portfolio proof · clear services for small businesses **across industries**.

---

## Tier A — Study deeply (best fit)

| Site | Why it matters | Steal |
|------|----------------|-------|
| [rauno.me](https://rauno.me/) | Personal, minimal, sharp interaction | Project-first hierarchy; short identity line; no niche clutter |
| [brittanychiang.com](https://brittanychiang.com/) | Classic personal hireable portfolio | About + work + clear “get in touch”; sticky nav honesty |
| [bymonolog.com](https://bymonolog.com/) | Editorial proof + massive type | Metric-forward case rows; services as giant type; “gap” narrative |
| [mainframe.co.uk](https://www.mainframe.co.uk/) | Motion studio IA | `/ About (01)` labels; duplicated CTA text; image-led work |
| [furo.studio](https://furo.studio/) | Dot matrix / numbered craft | Computational hero; orange accent; process numbering |
| [playfight.com](https://playfight.com/) | Scroll + scattered media | Atmosphere without dashboard clutter |
| A24 (a24films.com) | Mood / grain / restraint | Texture, spacing, cinematic quiet |

## Tier B — Personal / experimental portfolios

| Site | Notes |
|------|--------|
| [Cynx Portfolio 2026](https://www.awwwards.com/sites/cynx-portfolio-2026) | Mood match (dark, motion). Steal *feel*, not heavy WebGL unless ready |
| [ZARCEROG](https://www.awwwards.com/sites/zarcerog) | Editorial scrollytelling, horizontal project showcase |
| [Pacôme Pertant](https://www.awwwards.com/sites/pacome-pertant-portfolio) | Rhythm, transitions — personal creative brand |
| [James Breedlove Portfolio](https://www.awwwards.com/sites/james-breedlove-portfolio) | Cinematic personal scroll, strong hero |

## Tier C — Founder-led web design (SMB-friendly, not trade-locked)

| Site | Notes |
|------|--------|
| [Trajectory Web Design](https://www.awwwards.com/sites/trajectory-web-design-1) | Dark atmospheric, founder-led, many projects — “no-nonsense web design” energy |
| seekdeploy / seekanddeploy | Bold display + clean services list |
| Studio-of-one sites on Awwwards “portfolio” filter | Look for: About + Work + Services on one page |

## Galleries to mine regularly

- https://www.awwwards.com/websites/portfolio/
- https://www.dark.design/
- https://www.gallereee.com/style/dark-mode
- https://www.wallofportfolios.in/dark-theme

---

## Patterns that fit THIS brand (personal + services)

### Do more of
1. **Name as brand** — ARRIQ / Das as personal signal in hero
2. **Work before sales pitch** — portfolio earns the services list
3. **About in first person** — 2–3 honest paragraphs
4. **Services as a menu** — many offerings, not one niche slogan
5. **One clear CTA** — Start a project / Tell me about your business
6. **Soft location** — “Based in … · working with clients anywhere”
7. **Metrics when real** — placeholders labeled Coming Soon until true

### Do less of
1. Industry lock-in (“plumbers, HVAC, electricians”) as the whole identity
2. City lock-in in every meta tag and paragraph
3. Cold-outreach tone on the marketing surface
4. Fake specificity (“3x leads for Local Plumber”) without case studies

---

## Section inspo checklist (for next design passes)

- [x] Hero: personal brand + one outcome line + two CTAs
- [x] Work: honest stories (this site + experiments + open slot; no fake metrics)
- [x] About: first person + NOW + tools stack
- [x] Services: Web, Brand, Dev, Landing, SEO, UI, Maintenance (accordion)
- [x] Method: 4-step journey + SVG pathLength draw on scroll
- [x] Contact: email + phone + form; 24h reply; availability; GitHub
- [x] Footer: personal wordmark + nav + credits
- [x] Experiments lab strip for personal depth

### v4 pass notes (shipped)

- IA: `Hero → Work → Experiments → About → Gap → Method → Services → Stats → CTA → Contact`
- Stats: static honesty strip (2024 / 7 offerings / $500+ / FL) — no count-up zeros
- Motion: TextScramble hero, MagneticButton CTAs, Method path draw, grain-shift, ScrollReveal titles
- Lenis deferred (CSS smooth scroll only) to keep bundle/feel snappy
- Cursor: keep snappy expand-on-hover; no WebGL this pass

---

## Animation / craft inspo (keep snappy)

- Custom cursor: **keep** (user preference) — snappy follow, expand on interactive
- Dot matrix wordmark: keep computational identity
- Grain / vignette: subtle cinematic
- Prefer transform/opacity motion; respect `prefers-reduced-motion`
- Defer WebGL until portfolio has real case studies

---

## Competitive framing (how to talk about the work)

| Instead of | Prefer |
|------------|--------|
| “Websites for Largo plumbers” | “Sites for small businesses that need to look real and get inquiries” |
| “Local trades only” | “Independents & small teams — many industries” |
| “Largo FL web designer” (only) | “Designer & builder · based in Florida · remote-friendly” |
| Agency jargon | Personal, direct, specific outcomes |

---

## Next research actions

1. Save 5 new screenshots of personal portfolios with a **Services** section
2. Note how each handles location (usually one line, not the brand)
3. Collect 3 service menus with pricing ranges that feel honest
4. When first real case study ships, rewrite Work metrics to truth
5. Decide if liminal photography / experiments get a dedicated strip

---

## Sources

- Existing `cursor-research/*` (furo, monolog, mainframe, etc.)
- Awwwards portfolio + SOTD/HM listings (2026)
- rauno.me, brittanychiang.com patterns
- Freelance portfolio IA guides (hero / work / about / services / contact)

### v5 pass notes (in progress → ship)

- Multi-page: `/work` `/about` `/services` `/lab` `/now` `/contact` + Home Option B landing
- Shared chrome in `layout.tsx` (nav, grain, cursor, smooth scroll)
- Contact: Formspree when `NEXT_PUBLIC_FORMSPREE_ID` set, else mailto — no `/api` under static export
- Mobile full-screen spring nav; `/now` in footer; Lab statuses honest (live)
- Lenis / GSAP / WebGL still deferred
