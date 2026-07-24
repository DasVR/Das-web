# V4 Broad Inspiration — Personal + Portfolio + Services

Updated: 2026-07-24
Status: Active research for next Cursor iteration

---

## What changed from v3

- No longer trade-only (plumbers/HVAC as primary story)
- Now: personal brand + portfolio + broad small business services
- Keep: custom cursor, dot matrix, slash headers, dark editorial
- Add: more motion, more inspo sites, more personal voice
- Widen: all small businesses and independents, not just trades
- Keep location soft: "based in Florida, working with clients anywhere"

---

## Verified inspo sites (checked live)

### Tier A — Must study

#### 1. rauno.me
- Personal dev/design portfolio (works at Vercel)
- Structure: Home → Craft → Projects
- Very short about: "Estonian interaction designer working with Vercel"
- Projects open inline, no page jump
- Subtle hover lift on cards
- Clean monospace labels
- Minimal nav that stays out of the way
- Has craft section (interfaces.rauno.me) — deep interaction guidelines
- **Steal:** project-first hierarchy, short identity line, inline project expansion
- **Code:** CSS `transform: translateY(-4px)` on hover, `transition: transform 0.2s ease`

#### 2. brittanychiang.com
- Classic personal hireable portfolio
- Sticky side nav with active section highlight
- Work + About + Contact — honest, no fluff
- "Built with" credits in footer (nostalgic + human)
- Job history as timeline with dates
- Archive page for older/smaller projects
- **Steal:** IA clarity, sticky nav honesty, timeline layout
- **Note:** Not dark theme but structure is perfect. Dark-ify it.

#### 3. bymonolog.com
- Metric-forward agency/studio proof
- Giant type for service names
- "The Gap" narrative framing (we already have this)
- Real numbers on project cards (hide if not real yet)
- Editorial paragraph spacing (generous line-height)
- Cross/plus separator pattern
- **Steal:** massive type scale, metric honesty, editorial spacing

#### 4. mainframe.co.uk
- Motion studio, slash IA
- `/ Section (01)` labels (we have this, keep)
- Duplicated CTA text with slide-up reveal
- Image-led work showcase
- Dark + single accent color
- **Steal:** slash headers, duplicated text reveals

#### 5. furo.studio
- Computational / numbered craft
- Dot matrix hero vibe
- Numbered process steps with connecting lines
- Orange accent
- Process section with icons
- **Steal:** numbered systems, orange accent usage, craft positioning

#### 6. playfight.com
- Scroll-driven studio site
- Scattered media layout (images not in perfect grids)
- Scroll-linked parallax on images
- Atmospheric spacing
- Background elements that drift
- **Steal:** scattered layouts, parallax, breathing room
- **Code:** `useScroll` + `useTransform` from Framer Motion

#### 7. joshwcomeau.com
- Personal dev blog + portfolio
- Animated sparkles / decorative motion
- Custom cursor with trail effect
- Playful interactions (not corporate)
- Strong personal voice in copy
- **Steal:** playful cursor effects, personal voice, decorative motion

---

### Tier B — Galleries and collections to mine

- **gallereee.com** — curated portfolio gallery, dark mode section
- **awwwards.com/websites/portfolio** — professional portfolio examples
- **dark.design** — dark themed sites
- **wallofportfolios.in** — portfolio inspiration

---

## Motion effects to prioritize

### 1. Hero dot matrix animation (keep + enhance)
Current ARRIQ dot matrix SVG should animate:
- Dots pulse or flicker subtly on load
- Maybe cascade in from left to right
- Keep it subtle — not a light show

### 2. Text scramble / decode effect
Use on hero headline or one section title:
- Text starts as random characters, resolves to actual text
- Library: `use-scramble` or custom setInterval
- Use sparingly — once on load

### 3. Magnetic buttons
Buttons subtly pull toward cursor on hover:
- Track mouse position relative to button
- Translate X/Y by ~10-20px max
- Spring back on leave

### 4. Scroll-linked text reveal
Text fills from gray to white as it enters viewport:
- Split text into spans
- Use IntersectionObserver or Framer Motion `useInView`
- Each word reveals with slight delay

### 5. Method connector line
Vertical SVG line draws itself as you scroll through 01→02→03→04:
- Framer Motion `useScroll` + `pathLength`
- Steps fade in as line reaches them

### 6. Custom cursor upgrade (keep existing, enhance)
User loves current cursor. Enhancements:
- Expand on interactive elements (links, buttons)
- Subtle lag/spring follow (keep snappy)
- Consider dot that morphs to circle on hover

### 7. Section entrance variants
Standardize scroll entrance animations:
```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};
```

---

## Services section direction

### Current problem
Services were framed for trades only. Need to broaden while keeping small business focus.

### New framing
Giant type list (bymonolog style):
```
Web Design          Starting at $500
Branding            Starting at $350
Development         Included with design
Landing Pages       Starting at $400
SEO                 Starting at $200
UI / Product        Scoped per project
Maintenance         From $50 / month
```
- Full width, border-bottom separators
- Hover: text shifts right + arrow appears
- Expand on click for detail
- Keep pricing visible at all times

### Service descriptions (broad language)
- Web Design: "Clean, fast sites that turn visitors into inquiries"
- Branding: "Identity systems that feel like you"
- Development: "Built in Next.js with performance in mind"
- Landing Pages: "Focused pages that convert"
- SEO: "Found where people are searching"
- UI/Product: "Interfaces for apps, tools, and SaaS"
- Maintenance: "Ongoing care so it stays sharp"

---

## Work / Portfolio section

### Problem
All cards say "Coming Soon" with fake metrics (2M+, +23%, 3x).

### Solutions
1. Replace with personal experiments (this site itself, code art, tools)
2. Use "First projects loading" or "Case studies arriving"
3. Show process/behind-the-scenes
4. One "Your project here" card leading to contact

### Card layout options
- Large featured image with text overlay
- Side-by-side (image left, text right)
- Full-width strip with parallax image
- Or: show this portfolio site as Project #1

---

## Stats section fix

Current: "0+ Projects", "$0+", "0wk" — all zeros, looks bad.

Options:
1. **Hide entirely** until you have real numbers
2. **Replace with real info:**
   - "Building since 2024"
   - "$500–$1,500+ typical range"
   - "7 service offerings"
   - "Based in Florida · remote-friendly"

---

## Copy updates for broad positioning

### Hero
- "Websites that speak your brand's voice."
- Sub: "Personal portfolio & web design for small businesses and independents. Based in Florida, working with clients anywhere."
- CTAs: View Work · Start a Project

### About
- First person, 2-3 honest paragraphs
- Mention taste + craft + who you help (broad SMB)
- Home base mentioned lightly
- Add "Now" section (what you're working on)
- Tools/stack list

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
- Response time expectation
- Availability indicator

---

## Priority for next Cursor session

1. **Honesty pass** — Fix stats (hide zeros) and work cards (remove fake metrics)
2. **Hero dot matrix animation** — dots pulse/flicker on load
3. **Method connector line** — SVG draw animation
4. **Services expand interaction** — click to expand details
5. **Scroll text reveal** — headlines fade from gray to white
6. **Custom cursor enhance** — expand on interactive elements

---

## Research files referenced

- `personal-portfolio-direction.md` — positioning north star
- `v4-motion-inspo-update.md` — motion specifics and code patterns
- `cursor-prompt-v4.md` — Cursor IDE prompt with full context
- `design-direction.md` — identity, vibe, references
- `inspo-broad-2026.md` — earlier inspiration
