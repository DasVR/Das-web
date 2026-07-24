# V4 Research — Motion, Personal Brand + Broad Services

Compiled: 2026-07-24  
For: Cursor IDE prompt reference — Arriq / Das Web Design

---

## What changed (from v3)

- Site is now **personal + portfolio + services** (not trade-only)
- User wants **more motion and interaction**
- Keep custom cursor (loved)
- Keep dot matrix, slash headers, grain
- Widen to small business across industries

---

## Sites to study (specific things to steal)

### 1. rauno.me
**What it is:** Personal dev/design portfolio  
**Steal:**
- Project cards that open inline or expand (no page jump)
- Subtle hover lift + shadow on cards
- Very short about text (2 sentences max)
- "Selected work" instead of "Portfolio"
- Clean monospace labels on everything
- Minimal nav that stays out of the way

**Code pattern:** CSS `transform: translateY(-4px)` on hover, `transition: transform 0.2s ease`

---

### 2. brittanychiang.com
**What it is:** Classic personal hireable portfolio  
**Steal:**
- Sticky side nav with active section highlight
- Work + About + Contact — honest, no fluff
- "Built with" credits in footer (nostalgic + human)
- Job history as a timeline with dates
- Archive page for older / smaller projects

**Note:** Not dark theme but the IA is perfect. Dark-ify it.

---

### 3. bymonolog.com
**What it is:** Metric-forward agency / studio proof  
**Steal:**
- Giant type for service names (like our current services section but bigger)
- "The Gap" narrative framing (we already have this — expand it)
- Real numbers on project cards (hide if not real yet)
- Editorial paragraph spacing (generous line-height)
- Cross / plus separator pattern (we have · · · + — consider upgrading)

---

### 4. mainframe.co.uk
**What it is:** Motion studio, slash IA  
**Steal:**
- `/ Section (01)` labels (we have this, keep)
- Duplicated CTA text with slide-up reveal (we have this on buttons — expand to more elements)
- Image-led work showcase (need real screenshots)
- Dark + single accent color (orange for us)

---

### 5. furo.studio
**What it is:** Computational / numbered craft  
**Steal:**
- Dot matrix hero (we have ARRIQ svg — make it animate)
- Numbered process steps with connecting lines
- Orange accent (#f97316 or softer)
- Process section with icons

**Upgrade idea:** Make the dot matrix SVG dots pulse or flicker subtly on load.

---

### 6. playfight.com
**What it is:** Scroll-driven studio site  
**Steal:**
- Scattered media layout (images not in perfect grids)
- Scroll-linked parallax on images
- Atmospheric spacing (lots of breathing room between sections)
- Background elements that drift

**Code pattern:** `useScroll` + `useTransform` from Framer Motion for parallax

---

### 7. joshwcomeau.com
**What it is:** Personal dev blog + portfolio  
**Steal:**
- Animated sparkles / decorative motion
- Custom cursor with trail effect
- Playful interactions that don't feel corporate
- Strong personal voice in copy

---

### 8. gwern.net
**What it is:** Personal site, maximalist content  
**Steal:**
- Link underline animations (not just hover color change)
- Typography as design (headers are the design system)

---

## Motion effects to add (specific)

### 1. Text scramble / decode effect
Use on hero headline or section titles.
- Text starts as random characters, resolves to actual text
- Library: `use-scramble` or custom setInterval
- Use sparingly — once on load, not on every scroll

**Code direction:**
```tsx
// Custom hook
const useTextScramble = (text: string, trigger: boolean) => {
  const [display, setDisplay] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  useEffect(() => {
    if (!trigger) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) { clearInterval(interval); return; }
      setDisplay(text.slice(0, i) + chars[Math.floor(Math.random() * 26)]);
      i++;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger]);
  return display;
};
```

### 2. Scroll-linked text reveal
Text fills from gray to white as it enters viewport.
- Split text into spans
- Use IntersectionObserver or Framer Motion `useInView`
- Each word reveals with a slight delay

**Library:** `framer-motion` with `variants` and `staggerChildren`

### 3. Magnetic buttons
Buttons that subtly pull toward cursor on hover.
- Track mouse position relative to button
- Translate X/Y by ~10-20px max
- Spring back on leave

**Code direction:**
```tsx
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = buttonRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  setPosition({ x: x * 0.2, y: y * 0.2 });
};
```

### 4. Custom cursor upgrade (keep but enhance)
- Current cursor: good, keep snappy
- Add: cursor expands on interactive elements (links, buttons)
- Add: subtle lag / spring following (not too much — user said snappy)
- Consider: dot cursor that morphs to circle on hover

**Note:** User specifically said they love the custom cursor. Enhance, don't replace.

### 5. Horizontal scroll gallery (for Work section)
Instead of vertical stacking, consider a horizontal scroll strip for work cards.
- Desktop: horizontal scroll with pinned section
- Mobile: stays vertical
- Creates a "showcase" feel

**Library:** GSAP ScrollTrigger (horizontal scroll) or pure CSS scroll-snap

### 6. Noise / grain overlay upgrade
Current grain is static SVG noise. Consider:
- Subtle animated grain (CSS animation on background-position)
- Vignette edge darkening (radial gradient)
- Keep very subtle (opacity 0.03-0.06)

### 7. Section entrance variants
Standardize scroll entrance animations:
```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};
```
Apply to every section for consistency.

### 8. Method section connector line
Vertical SVG line that draws itself as you scroll through steps 01-04.
- Use Framer Motion `useScroll` + `pathLength`
- Line connects each step number
- Steps fade in as line reaches them

---

## Personal + Services layout patterns

### Services section upgrade options:

**Option A: Giant type list (bymonolog style)**
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
- Hover: text shifts right + arrow appears (already partially there)
- Expand on click for detail

**Option B: Card grid**
- 2 or 3 columns of cards with icon + title + price
- More visual, less editorial
- Good if services need explanation

**Option C: Hybrid (recommended)**
- Giant type list on desktop
- Card grid on mobile
- Keep expand/collapse for details

### Portfolio / Work section upgrade:

**Problem:** All cards say "Coming Soon" with fake metrics.
**Solutions:**
1. Replace with personal experiments (code art, this site itself, a tool you built)
2. Use "First projects loading" or "Case studies arriving" instead of fake metrics
3. Show the process / behind-the-scenes instead of finished work
4. One "Your project here" card that leads to contact

**Card layout options:**
- Large featured image with text overlay
- Side-by-side (image left, text right)
- Full-width strip with parallax image

### About section upgrade:

**Current:** Good first-person text.
**Add:**
- A "now" section (what you're working on right now)
- Tools / stack list (honest, not bragging)
- Maybe a photo (even a moody silhouette or workspace shot)
- "Previously" or experience timeline (brittanychiang style)

### Contact section upgrade:

**Current:** Email + phone + form.
**Add:**
- Response time expectation ("Usually reply within 24 hours")
- FAQ or "What happens next" after form submit
- Social links (GitHub, maybe X/Twitter if active)
- Availability indicator ("Taking new projects" / "Booked til [month]")

---

## Specific code resources

### Libraries worth adding:
- **GSAP + ScrollTrigger** — if you want complex scroll animations (horizontal gallery, pinned sections)
- **lenis** — smooth scroll (luxury feel)
- **framer-motion** — already using, perfect for most things
- **split-type** — text splitting for reveal animations

### CodePen / article references:
1. "Text scramble effect" — search CodePen for vanilla JS implementation
2. "SVG line draw on scroll" — GSAP ScrollTrigger path animation
3. "Magnetic button effect" — CSS + JS hover tracking
4. "Custom cursor with hover states" — CSS transform + transition
5. "Horizontal scroll section" — GSAP ScrollTrigger pinned section

### Keep lightweight rule:
- No WebGL unless you have a real reason
- No heavy libraries for one effect
- Prefer transform/opacity animations (GPU friendly)
- Respect `prefers-reduced-motion`

---

## Priority order for Cursor

### Phase 1 (high impact, doable)
1. **Fix Work section** — remove fake metrics, add real personal projects or honest placeholders
2. **Fix Stats section** — hide zeros or replace with something real (years building, tools used, etc.)
3. **Text scramble on hero** — one effect, big payoff
4. **Method connector line** — SVG draw animation
5. **Magnetic buttons** — subtle, everywhere CTAs are

### Phase 2 (medium impact)
6. **Scroll text reveal** — section headlines fill from gray to white
7. **Services expand interaction** — click to expand details (accordion or overlay)
8. **Noise animation** — subtle moving grain
9. **About "now" section** — what you're working on

### Phase 3 (polish)
10. **Horizontal work gallery** — if you have enough projects
11. **Smooth scroll (lenis)** — luxury feel
12. **Archive page** — old experiments, smaller work
13. **Custom cursor enhancement** — expand on interactive elements

---

## Copy updates needed

### Stats (replace zeros)
Instead of:
- 0+ Projects → "Building since 2024" or hide entirely
- 0+ Services → "7 service offerings" or hide
- $0+ → "$500–$1,500+ typical range" (this is real!)
- 0wk → "1–2 week delivery" or "Typical: 1–2 weeks"

### Work cards
Instead of "2M+" / "+23%" / "3x" with "Coming Soon":
- Label as "Personal Project" or "Experiment"
- Or: "Case studies shipping soon — your project could be here"
- Or: show this portfolio site itself as a project

### Hero
Consider iterating headline. Options:
- "Websites that speak your brand's voice." (current, good)
- "Design and build for small businesses." (more direct)
- "Arriq — personal portfolio & web design." (clearer)

---

## Success check for next deploy

- [ ] No fake metrics or placeholder numbers
- [ ] Services feel broad but clear
- [ ] At least one real project or honest experiment shown
- [ ] One scroll/motion effect that makes people go "how'd they do that"
- [ ] Custom cursor still snappy and loved
- [ ] Mobile doesn't break (test after every motion addition)
- [ ] Load time stays fast (no bloat)

---

## Files referenced

- `personal-portfolio-direction.md` — positioning north star
- `inspo-broad-2026.md` — earlier inspiration
- `v3-enhancement-research.md` — craft details
- `v3-real-site-analysis.md` — current site audit
