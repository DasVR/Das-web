# Cursor IDE Prompt — Portfolio v4 (Personal + Portfolio + Broad Services)

## Project Context
This is a Next.js 14 portfolio site for "Arriq / Das Web Design" — a personal website, portfolio, and service offering for small businesses across industries. The site is deployed at https://dasdev.net.

**NOT a niche trades-only shop. NOT a faceless agency. This is a personal brand.**

## Current Tech Stack
- Next.js 14 App Router with static export
- Tailwind CSS with custom dark theme
- shadcn/ui components
- Framer Motion for animations
- Lucide React icons
- Docker + Caddy + Cloudflare Tunnel deployment

## What this site is now

| Layer | Meaning |
|-------|---------|
| **Personal** | First-person. Arriq's taste, process, voice. About is real, not corp-speak. |
| **Portfolio** | Selected work, experiments, case studies when ready. Proof over promises. |
| **Services** | Hireable for small businesses and independents — many industries, not one vertical. |
| **Location** | Based in Florida. Open to clients anywhere. Soft-local, not locked-local. |

## Design Direction (REFERENCES — study deeply)

### Tier A — Best fit for our brand
1. **rauno.me** — personal, minimal, sharp interaction. Project-first hierarchy; short identity line; no niche clutter.
2. **brittanychiang.com** — classic personal hireable portfolio. About + work + clear "get in touch"; sticky nav honesty.
3. **bymonolog.com** — editorial proof + massive type. Metric-forward case rows; services as giant type; "gap" narrative.
4. **mainframe.co.uk** — slash headers (/About, /Work), motion studio feel, duplicated CTA text.
5. **furo.studio** — dot matrix hero, numbered sections, orange accent, computational craft.
6. **playfight.com** — scroll-driven scattered media. Atmosphere without clutter.
7. **joshwcomeau.com** — playful interactions, custom cursor, strong personal voice.

### Tier B — Motion and craft
- Cynx Portfolio 2026 (awwwards) — dark motion feel
- ZARCEROG (awwwards) — editorial scrollytelling
- Trajectory Web Design (awwwards) — founder-led SMB, dark atmospheric

### Galleries to mine regularly
- https://www.awwwards.com/websites/portfolio/
- https://www.dark.design/
- https://www.gallereee.com/style/dark-mode
- https://www.wallofportfolios.in/dark-theme

## Current Issues to Fix (Priority Order)

### CRITICAL — Before any new motion

1. **Stats section shows all zeros** — "0+ projects", "$0+", "0wk"
   - HIDE the stats section entirely OR replace with real info
   - Ideas: "Building since 2024", "$500–$1,500+ typical range", "7 service offerings", "Based in Florida · remote-friendly"

2. **Work cards have fake metrics with "Coming Soon"**
   - Remove: "2M+", "+23%", "3x" — these are misleading without real case studies
   - Replace with: personal experiments, this portfolio site itself, or honest placeholders
   - Label as: "Personal Project", "Experiment", "Case studies arriving — your project could be here"

3. **Copy still needs broader framing**
   - Remove any trade-only language (plumbers, HVAC, electricians as the ONLY story)
   - Keep small business focus but widen: consultants, creators, hospitality, retail, startups, etc.
   - Location: mention once lightly, not in every sentence

### HIGH PRIORITY — Motion and interaction

4. **Hero needs more impact**
   - Dot matrix "ARRIQ" SVG should animate (dots pulse/flicker on load)
   - Consider text scramble/decode effect on headline: "Websites that speak your brand's voice" starts as random characters, resolves
   - Magnetic buttons on CTAs (subtle pull toward cursor)

5. **Work section needs real content or honest framing**
   - Show this portfolio site as a project
   - Show any experiment, tool, or side project
   - If nothing yet: "First projects loading. Want to be the first case study?"

6. **Method section needs visual connectors**
   - SVG vertical line that draws itself as you scroll through 01→02→03→04
   - Use Framer Motion `useScroll` + `pathLength`
   - Steps fade in as line reaches them

7. **Services section needs interaction**
   - Giant type list (already partially there)
   - Click to expand details (accordion)
   - Hover: text shifts right + arrow appears
   - Pricing stays visible: "Starting at $500", etc.

### MEDIUM PRIORITY — Polish and personality

8. **Scroll-linked text reveal**
   - Section headlines fill from gray/neutral-600 to white as they enter viewport
   - Split text into spans, stagger reveal

9. **Noise/grain overlay upgrade**
   - Current static SVG noise → subtle animated grain
   - CSS animation on background-position, very subtle
   - Add vignette edge darkening (radial gradient)

10. **About section depth**
    - Add "Now" section (what you're working on currently)
    - Tools / stack list
    - Consider: "Previously" timeline or experience

11. **Contact section upgrade**
    - Response time expectation ("Usually reply within 24 hours")
    - Social links (GitHub at minimum)
    - Availability indicator ("Taking new projects" / "Booked until [month]")

12. **Custom cursor enhancement**
    - KEEP the cursor (user loves it)
    - Expand cursor on interactive elements (links, buttons)
    - Subtle lag/spring follow (not too much — keep snappy)
    - Consider: dot that morphs to circle on hover

## Immediate Tasks (in priority order)

### Task 1: Fix Stats + Work (honesty pass)
- Hide or rewrite stats to be real
- Replace fake metrics in Work cards
- Add at least one real project or experiment

### Task 2: Hero Animation
- Dot matrix pulse/flicker on load
- Optional: text scramble on headline
- Magnetic buttons on CTAs

### Task 3: Method Connector Line
- SVG line draw animation connecting 01→02→03→04
- Steps reveal as line progresses

### Task 4: Services Expand
- Click to expand service details
- Keep giant type + pricing visible at all times

### Task 5: Scroll Text Reveal
- Section headlines fade from gray to white
- Apply to: Work, About, Services, Contact headings

### Task 6: Global Polish
- Animated grain overlay
- Custom cursor expand on hover
- Smooth scroll (optional: lenis library)
- Section entrance animation standardization

## File Structure
```
src/
  app/
    page.tsx           — main landing page
    layout.tsx         — root layout with fonts + metadata
    globals.css        — tailwind + custom styles
    sections/
      Hero.tsx         — dot matrix hero + scramble effect
      Stats.tsx        — hide or rewrite
      Work.tsx         — selected work (real content only)
      Gap.tsx          — the gap narrative
      About.tsx        — personal about + now + tools
      Method.tsx       — 01-04 process with connector line
      Services.tsx     — service list with expand interaction
      CTA.tsx          — call to action
      Contact.tsx      — contact + footer
  components/
    ui/                — shadcn components
    DotMatrix.tsx      — reusable dot matrix component (animated)
    AnimatedSection.tsx — scroll reveal wrapper
    ProjectCard.tsx    — work card component
    TextScramble.tsx   — text decode effect component
    MagneticButton.tsx — magnetic hover button
    ScrollReveal.tsx   — text fill from gray to white
  lib/
    utils.ts           — cn() helper
```

## Color Reference
- bg: #0a0a0a
- text-primary: #ffffff
- text-secondary: #a3a3a3 (neutral-400)
- text-muted: #525252 (neutral-600)
- border: #262626 (neutral-800)
- accent: #f97316 (orange-500, optional)

## Fonts
- Headings: Space Grotesk
- Body: Inter
- Use next/font/google for optimal loading

## Animation Guidelines
- Use Framer Motion `useInView` for scroll-triggered animations
- Stagger children: 0.1s delay between items
- Easing: `[0.25, 0.1, 0.25, 1]` (ease-out-cubic feel)
- Keep animations subtle — no bouncing, no over-the-top effects
- Respect `prefers-reduced-motion`
- Prefer transform/opacity (GPU friendly)

## New Libraries to Consider
- **GSAP + ScrollTrigger** — complex scroll animations (horizontal gallery, pinned sections)
- **lenis** — smooth scroll (luxury feel)
- **split-type** — text splitting for reveal animations
- Keep lightweight: no WebGL unless absolutely necessary

## Copy Framework

### Hero
- Brand: ARRIQ (animated dot matrix)
- Headline: "Websites that speak your brand's voice." or iterate
- Sub: "Personal portfolio & web design for small businesses and independents. Based in Florida, working with clients anywhere."
- CTAs: View Work · Start a Project

### About
- First person, 2–3 honest paragraphs
- Mention taste + craft + who you help (broad SMB)
- Home base mentioned lightly
- Add "Now" section

### Work
- Mix of industries when available
- Metrics when real; honest labels when not
- Personal projects welcome next to client work

### Services
- Giant stacked names or clean rows
- Expand for detail + starting price
- Broad language: "small businesses and independents across industries"

### Contact
- "Based in Florida · working with clients wherever you are."
- Response time + availability

## Deployment Notes
- `npm run build` outputs to `dist/`
- Dockerfile builds static site and serves via nginx
- Caddy reverse proxies from Cloudflare Tunnel
- To deploy: rebuild image, restart container, reload Caddy

## Research Files in cursor-research/
- `design-direction.md` — identity, vibe, references
- `personal-portfolio-direction.md` — positioning north star (broad SMB)
- `inspo-broad-2026.md` — expanded inspiration
- `v4-motion-inspo-update.md` — THIS file's research + motion specifics
- `v3-enhancement-research.md` — earlier craft details
- `v3-real-site-analysis.md` — current site audit
- `portfolio-inspiration.md` — saved links from galleries
- `business-info.txt` — phone, email, pricing

## User's Long-Term Vision
- Build real client projects to fill the portfolio
- Offer maintenance packages
- Expand to branding + SEO
- Keep site as living personal brand — not a static brochure

---

**START WITH:** Honesty pass on Stats + Work, then Hero dot matrix animation.
**Then:** Method connector line, services expand, scroll text reveal.
