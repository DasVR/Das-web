# V5: Massive Site Inspiration & Architecture Document
## Arriq / Das Web Design — dasdev.net
### Compiled: July 24, 2026

---

## THE VISION

Your site is not just a portfolio. It is a **demonstration of craft** — every pixel, every hover state, every transition proves what you can do for clients. It also tells YOUR story. Founder-led. 15 years old. Building in public. Taste + skill + hustle.

**The goal:** A multi-page site that feels like a premium creative studio AND a personal brand. Something clients show their friends. Something that makes people say "this kid builds websites?"

---

## SITE ARCHITECTURE (Multi-Page)

### Recommended Page Structure

| Page | Purpose | Key Elements |
|------|---------|-------------|
| **Home** `/` | The hook. First impression. | Dot matrix hero, massive ARRIQ wordmark, hero copy, scroll indicator |
| **Work** `/work` | Selected projects + case studies | Filterable grid, case study deep-dives, honest metrics |
| **Services** `/services` | What you offer + pricing | Giant type expand cards, process walkthrough, pricing |
| **About** `/about` | Who you are | Photo, story, tools, now/learning, personality |
| **Lab** `/lab` | Experiments in public | Motion studies, component demos, dot matrix playground |
| **Now** `/now` | What you're doing rn | Current projects, reading, learning, building |
| **Contact** `/contact` | How to hire you | Form, calendly, email, phone, availability status |
| **Writing** `/writing` | Blog/tutorials (future) | Josh Comeau style — this builds authority over time |

### Navigation Strategy

**Option A: Minimal Sticky Top Bar (Rauno + Brittany hybrid)**
- Fixed top, transparent → solid on scroll
- Links: Work, Services, About, Lab, Contact
- Small "ARRIQ" wordmark on left
- Custom cursor changes on nav items

**Option B: Full-Screen Overlay Nav (Monolog / Mainframe energy)**
- Hamburger triggers massive typography nav
- Each link is 80px+ display type
- Background image/video changes per link on hover
- More dramatic, more memorable

**Option C: Hybrid — Minimal bar + playful detail**
- Top bar most of the time
- On mobile, morphs into something unexpected
- "Menu" text that scrambles on hover

**RECOMMENDATION:** Start with Option A (sticky minimal) but add personality — the nav links could have a subtle scramble effect on hover, or the ARRIQ wordmark could pulse/flicker. Keep it functional but with taste.

---

## GOLD STANDARD SITE ANALYSIS

### 1. rauno.me
**URL:** https://rauno.me
**Category:** Personal / Developer / Interaction-First

**What Makes It Special:**
- Every interaction has physics. Hover over anything and it responds with weight and momentum
- No traditional "sections" — feels like an app, not a website
- Custom cursor changes shape based on what you're hovering
- Content is delivered in "cards" or "widgets"

**Page Structure:**
- Single-page hub but feels modular
- Projects are presented as interactive previews
- About info is compact, not a wall of text
- Uses a "toolkit" section showing what he uses

**Steal For Your Site:**
- **Interaction-first mindset:** Every button, every link, every card should have a satisfying hover state
- **Custom cursor that adapts:** Not just a dot — change size/shape on different elements
- **Modular presentation:** Your work section should feel like widgets, not a boring grid
- **Compact density:** Say more with less. White/black space is your friend

---

### 2. brittanychiang.com
**URL:** https://brittanychiang.com
**Category:** Developer Portfolio / Dark Mode / Professional

**What Makes It Special:**
- Consistency across EVERYTHING — colors, spacing, typography
- Deep dark mode with high-contrast accent (teal/green)
- Sticky sidebar navigation on desktop
- Dense information presented cleanly
- "Experience" timeline that's actually readable

**Page Structure:**
- Hero with name + tagline
- About / Experience / Projects / Contact — all inline sections
- Left sidebar nav smooth-scrolls to each section
- Projects are detailed with tech stack, links, descriptions

**Steal For Your Site:**
- **Sticky nav with smooth scroll:** Even as a multi-page site, keep smooth scroll for anchor links
- **High-contrast accent borders:** Orange on dark grey cards looks 🔥
- **Dense but readable:** Don't be afraid of content — just organize it well
- **Timeline for experience:** Your "journey" section could have a vertical timeline

---

### 3. joshwcomeau.com
**URL:** https://www.joshwcomeau.com
**Category:** Educator / Developer / Personality-First

**What Makes It Special:**
- Strong personal voice in every sentence
- Interactive "playgrounds" embedded in articles
- Playful cursor (sparkles!)
- Hybrid structure: strong home + deeply nested blog
- Shows process, not just results

**Page Structure:**
- Home: Name + playful illustration + newsletter CTA
- Blog: Deeply nested, tons of interactive demos
- About: Personal story with humor
- Uses a "table of contents" sidebar for long articles

**Steal For Your Site:**
- **Personality in copy:** Your site should sound like YOU, not a corporate template
- **Interactive demos:** In your Lab page, embed working components, not just screenshots
- **Show process:** "How I built this" articles build massive credibility
- **Newsletter/now page:** "What I'm learning" creates a reason to return

---

### 4. bymonolog.com
**URL:** https://bymonolog.com
**Category:** Creative Agency / Editorial / Giant Typography

**What Makes It Special:**
- Typography so big it fills the entire viewport
- "MONOLOG" wordmark is the entire hero
- Scattered, asymmetric layouts (not everything grid-aligned)
- Stat counters with real metrics
- "We close ‎ ‎ ‎ ‎ ‎ ‎ that gap" — invisible chars creating gaps in text

**Page Structure:**
- Home: Massive wordmark + scattered images
- Work: Left-aligned names + right-aligned BIG metrics
- Services: Giant stacked words, not bullet points
- About: Founder headshot + story

**Steal For Your Site:**
- **Giant typography:** Your ARRIQ wordmark should be IMMENSE on the home page
- **Scattered layouts:** Not everything needs to be in a grid. Asymmetry = premium
- **Stat counters:** Real numbers that count up on scroll (but HONEST ones — "7 services" not "200+")
- **Invisible char gaps:** Playful typographic tricks show attention to detail

---

### 5. mainframe.co.uk
**URL:** https://mainframe.co.uk
**Category:** Agency / Minimal / Slash Headers

**What Makes It Special:**
- Slash headers: "/ About (01)", "/ Work (02)"
- Duplicated CTA text: "Start a project Start a project →"
- Very minimal navigation
- Service cards with imagery, not just text
- Clean, editorial spacing

**Page Structure:**
- Home: Big statement + CTA
- About: Slash header + team/story
- Work: Image-dominant grid
- Contact: Simple form

**Steal For Your Site:**
- **Slash headers with numbering:** "/ Work (01)", "/ Services (02)" — instant editorial feel
- **Duplicated CTA text:** A bold pattern that fills space and creates rhythm
- **Image-dominant grids:** Let your work speak visually
- **Editorial spacing:** Generous padding, breathing room between everything

---

### 6. furo.studio
**URL:** https://furo.studio
**Category:** Studio / Craft / Numbered Process

**What Makes It Special:**
- Numbered craft sections: "01 Strategy", "02 Design", "03 Build"
- Orange accent on dark backgrounds (sounds familiar?)
- Clean process visualization
- Premium but approachable

**Page Structure:**
- Home: Hero + process overview
- Work: Selected projects
- Services: Detailed breakdowns
- About: Team + philosophy

**Steal For Your Site:**
- **Numbered process:** Your Method section already does this — expand it
- **Orange accent discipline:** You're already doing this. Keep it consistent
- **Process visualization:** Show HOW you work, not just WHAT you deliver

---

### 7. playfight.com
**URL:** https://playfight.com
**Category:** Creative Studio / Playful / Parallax

**What Makes It Special:**
- Scattered, floating layouts — things aren't aligned to a strict grid
- Parallax effects on images
- Lots of breathing room
- Feels fun but professional
- Asymmetric compositions

**Page Structure:**
- Home: Playful hero + work preview
- Work: Scattered project cards
- About: Team + culture
- Contact: Big, bold CTA

**Steal For Your Site:**
- **Scattered layouts:** Your Work page doesn't need a perfect grid
- **Parallax on images:** Subtle depth as you scroll
- **Breathing room:** Don't fill every pixel. Let things breathe
- **Asymmetric compositions:** Offset images, overlapping text, playful positioning

---

## ADDITIONAL INSPIRATION SITES

### 8. awwwards.com Portfolios (2025 Winners)
**What to look for:**
- Dark editorial portfolios with grain/noise
- Sites that blend personal + professional
- Creative navigation patterns
- Typography-driven layouts

**Search terms:** "awwwards portfolio of the year 2025", "awwwards dark portfolio"

---

### 9. wallofportfolios.in
**URL:** https://wallofportfolios.in
**What to look for:**
- Curated list of standout portfolios
- Filter by style (dark, minimal, editorial)
- Great for finding new references

---

### 10. gallereee.com
**URL:** https://gallereee.com
**What to look for:**
- Portfolio gallery with high curation
- Trending designs
- Category: "Developer" or "Designer"

---

### 11. Linear-inspired Portfolios
**Style:** Deep charcoal, subtle grid lines, glow effects
**Pattern:** Bento-grid layouts for About section
**Typography:** Inter/Geist Sans + bold Serif for headers

---

### 12. "Digital Garden" Sites (e.g., 21st.studio)
**Style:** Portfolio + live stream of thoughts
**Pattern:** A "Now" page separate from "Work"
**Why for you:** Shows you're a "student of the craft" — endearing for a 15-year-old

---

### 13. Neo-Brutalist Dark Portfolios
**Style:** Harsh borders, high-contrast orange/black
**Pattern:** "Sticker" style elements that overlap
**Why for you:** Shows edge and confidence. Could be a secondary style for the Lab page

---

### 14. "OS" Portfolios
**Style:** Mimics a desktop environment (folders, windows)
**Why for you:** Demonstrates technical skill in a fun way
**Best for:** Lab page or a playful "About" section

---

### 15. "Timeline" Portfolios
**Style:** Vertical line connecting projects from past to present
**Why for you:** Your journey from hobbyist to professional is a story worth telling

---

## MOTION & INTERACTION PATTERNS

### Core Tech Stack Upgrade

| Library | Purpose | Install |
|---------|---------|---------|
| **Lenis** | Smooth scroll (foundation for ALL premium motion) | `npm install lenis` |
| **GSAP + ScrollTrigger** | Complex scroll animations, timelines | `npm install gsap` |
| **Split-Type** | Text splitting for reveals | `npm install split-type` |
| **Framer Motion** | Component animations, page transitions | Already installed |

**Implementation Order:**
1. Install Lenis FIRST — it makes everything feel better
2. Add GSAP ScrollTrigger for scroll-driven effects
3. Use Split-Type + GSAP for text reveals
4. Keep Framer Motion for component-level animations

---

### 1. Text Scramble / Decode Effect
**Description:** Text cycles through random characters before settling on the final word.

**Where to use:**
- Hero headline on page load
- Nav link hovers
- Section headers on scroll-in
- Your name "ARRIQ" on the home page

**Implementation:**
```javascript
// Custom hook approach
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const scrambleText = (element, targetText, duration = 1200) => {
  let iterations = 0;
  const interval = setInterval(() => {
    element.innerText = targetText
      .split("")
      .map((char, index) => {
        if (index < iterations) return targetText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
    if (iterations >= targetText.length) clearInterval(interval);
    iterations += 1 / 3; // speed
  }, 30);
};
```
**Difficulty:** Medium
**Library:** Custom (lightweight) or `use-scramble`

---

### 2. Magnetic Buttons
**Description:** Buttons "pull" toward the cursor when nearby.

**Where to use:**
- CTA buttons ("Start a project", "View work")
- Nav links
- Social links
- Form submit button

**Implementation:**
```javascript
// Using Framer Motion useSpring
const magneticRef = useRef(null);
const x = useMotionValue(0);
const y = useMotionValue(0);
const springConfig = { damping: 15, stiffness: 150 };
const springX = useSpring(x, springConfig);
const springY = useSpring(y, springConfig);

const handleMouseMove = (e) => {
  const rect = magneticRef.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.sqrt(
    Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
  );
  if (distance < 100) { // magnetic radius
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }
};
```
**Difficulty:** Medium
**Library:** Framer Motion `useSpring` or GSAP `quickTo`

---

### 3. SVG Stroke Draw Animations
**Description:** Lines that "draw" themselves on scroll or page load.

**Where to use:**
- Method section connector line (01 → 02 → 03 → 04)
- Underlines on headers
- Decorative elements between sections
- Project card borders

**Implementation:**
```css
/* CSS approach */
.stroke-draw {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```
**GSAP approach:**
```javascript
gsap.to("#connector-line", {
  strokeDashoffset: 0,
  scrollTrigger: {
    trigger: "#method-section",
    start: "top center",
    end: "bottom center",
    scrub: 1
  }
});
```
**Difficulty:** Easy/Medium
**Library:** GSAP ScrollTrigger or pure CSS

---

### 4. Scroll-Triggered Text Reveals
**Description:** Text slides up from hidden overflow or changes color on viewport entry.

**Where to use:**
- Section headlines ("/ Work (01)")
- Body text paragraphs
- Stats numbers
- CTA headlines

**Implementation:**
```javascript
// Split-Type + GSAP
import SplitType from 'split-type';

const text = new SplitType('#headline', { types: 'words,lines' });

gsap.from(text.lines, {
  y: 100,
  opacity: 0,
  stagger: 0.1,
  duration: 1,
  ease: "power4.out",
  scrollTrigger: {
    trigger: '#headline',
    start: 'top 80%'
  }
});
```
**Difficulty:** Medium
**Library:** Split-Type + GSAP ScrollTrigger

---

### 5. Premium Page Transitions
**Description:** Seamless shifts between pages that feel app-like.

**Where to use:**
- All route changes in Next.js App Router
- Work → Case Study transitions
- Home → Any page

**Implementation:**
```typescript
// app/template.tsx
'use client';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
```
**Advanced:** Full-screen overlay that slides across (black curtain effect)
**Difficulty:** Medium
**Library:** Framer Motion `AnimatePresence` + `template.tsx`

---

### 6. Dot Matrix / Grid Animations
**Description:** Background grid of dots that react to cursor proximity.

**Where to use:**
- Hero background (you already have this — enhance it)
- Lab page background
- About page decorative element

**Implementation:**
```javascript
// Canvas approach for performance
const canvas = document.getElementById('dot-grid');
const ctx = canvas.getContext('2d');
// Draw grid of dots
// On mousemove, calculate distance to each dot
// If distance < radius, scale up + brighten
```
**Enhancement ideas:**
- Dots "wake up" in waves on page load
- Dots trace the cursor path
- Dots form shapes/letters on scroll

**Difficulty:** Hard
**Library:** HTML5 Canvas (recommended) or CSS Grid + Framer Motion

---

### 7. Noise & Grain Overlays
**Description:** Subtle film grain that removes the "sterile" digital look.

**Where to use:**
- Full-site overlay (you already have this — keep it)
- Card backgrounds
- Image overlays
- Section dividers

**Implementation:**
```css
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  animation: grain 0.5s steps(1) infinite;
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1%, -1%); }
  20% { transform: translate(1%, 1%); }
  /* etc */
}
```
**Difficulty:** Easy
**Library:** Pure CSS/SVG

---

### 8. 3D Depth & Parallax
**Description:** Elements move at different speeds or shift perspective.

**Where to use:**
- Hero section (images float at different depths)
- Work cards (images parallax inside their containers)
- About page (photo + text at different speeds)

**Implementation:**
```javascript
// GSAP ScrollTrigger parallax
gsap.to(".parallax-image", {
  y: -100,
  scrollTrigger: {
    trigger: ".parallax-container",
    start: "top bottom",
    end: "bottom top",
    scrub: 1
  }
});
```
**Advanced:** Spline 3D scene embedded in hero
**Difficulty:** Medium/Hard
**Library:** GSAP ScrollTrigger or `@splinetool/react-spline`

---

### 9. Custom Cursor Enhancements
**Description:** Your current cursor is good — level it up.

**Enhancement ideas:**
- **Trail effect:** Multiple cursor dots that follow with delay
- **Morph on hover:** Cursor becomes a circle, arrow, or text label depending on element
- **Magnetic snap:** Cursor sticks to buttons when close
- **Color shift:** Cursor color inverts based on background
- **Dot matrix cursor:** Cursor is made of tiny dots

**Implementation:**
```javascript
// Morph on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
  });
});
```
**Difficulty:** Medium
**Library:** Custom + Framer Motion for smooth follow

---

### 10. Scroll Progress & Indicators
**Description:** Visual indicator of how far through the page you are.

**Where to use:**
- Thin line at top of viewport (orange, of course)
- Circular progress on case study pages
- Section markers that fill as you pass them

**Implementation:**
```javascript
// Top progress bar
const progressBar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = `${progress}%`;
});
```
**Difficulty:** Easy
**Library:** Custom

---

## COPY & CONTENT DIRECTION

### Hero (Home Page)
**Current:** "Websites that speak your brand's voice."
**Potential upgrades:**
- "Designer & builder. 15, self-taught, serious about craft." (bold, honest)
- "I make websites that don't look like templates." (confident)
- "Web design for small businesses. Built by a 15-year-old who cares." (personal + hook)
- **Text scramble version:** Letters decode from random chars to final message

### Work Page
**Honest approach:**
- "2 projects shipped. More coming. Here's what I'm proud of."
- "Every project is a learning experiment. These are the ones worth showing."
- **Case study format:** Problem → Process → Solution → Result (even if result is just "client was happy")

### Services Page
**Frame it right:**
- Use "Investment" instead of "Price" where appropriate
- Show the process: "How it works" with 1→2→3 steps
- Be transparent: "$500–$1,500. Most projects land in the middle."
- **Digital Native angle:** "I build fast with modern tools. No page-builder bloat."

### About Page
**Your story:**
- Photo of you (yes, actually — clients want to see WHO they're hiring)
- "Started at 13. First client at 14. Now 15 and taking this seriously."
- Tools you use
- What you're learning rn
- Favorite music (Nirvana, FF, Deftones) — personality!
- "Based in Florida. Happy to work with anyone, anywhere."

### Now Page
**Inspired by Derek Sivers / nownownow.com:**
- What you're working on this week
- What you're reading/learning
- Recent experiments
- Current playlist
- This page updates frequently — gives people a reason to come back

---

## PERSONALITY LAYERS

Ideas to make this site feel like YOU:

1. **Music references:** Subtle nods to Nirvana/Deftones in copy or design
2. **Age as an asset:** "15 years old. 3 years of building. No bureaucracy, just results."
3. **Dog person:** Mention Jasper somewhere (people love dogs)
4. **Liminal photography:** Use your own photos as textures/backgrounds
5. **Dexter reference:** Subtle Easter egg somewhere (dark humor)
6. **Late night energy:** "Usually up til 4am coding. Your timezone doesn't matter."
7. **Tool obsession:** Show your setup, your stack, your config files
8. **Learning in public:** "I don't know everything. But I learn fast and I ship."

---

## MULTI-PAGE TRANSITION STRATEGY

### Phase 1: Home + Work + Contact (3 pages)
- Extract Work section to `/work`
- Extract Contact section to `/contact`
- Keep Services, About, Experiments on Home for now
- Add page transitions with Framer Motion

### Phase 2: Add Services + About (5 pages)
- Extract Services to `/services`
- Extract About to `/about`
- Add detailed content to each

### Phase 3: Add Lab + Now (7 pages)
- `/lab` becomes your experiments showcase
- `/now` becomes your "what I'm doing" page
- Consider a `/writing` page for long-term authority building

---

## THE AIRDROP APP IDEA (Bonus Project)

**Concept:** A digital business card app that uses AirDrop-style sharing + NFC tap, with completely custom UI.

**What it shares:**
- Your contact info
- Links to portfolio, GitHub, socials
- A mini "about me" card
- Maybe a live "availability" status

**Why it's cool:**
- At networking events: tap phone → instant share
- No Apple share sheet UI — fully custom, premium feel
- Demonstrates mobile dev skills
- Could be a service you offer: "I can build YOUR digital business card too"

**Tech approach:**
- SwiftUI for iOS native feel
- NFC Core framework for tap-to-share
- AirDrop via ShareSheet (but wrapped in custom UI)
- QR code fallback for Android/non-NFC
- PWA version for broader reach

**Status:** Save for later. Keep in mind. Not a priority rn.

---

## IMPLEMENTATION PRIORITY

### Immediate (This Week)
1. ✅ Fix deploy pipeline (done)
2. ⬜ Install Lenis smooth scroll
3. ⬜ Extract Work to `/work` page
4. ⬜ Add page transitions with template.tsx
5. ⬜ Enhance dot matrix hero animation

### Short Term (Next 2 Weeks)
6. ⬜ Implement text scramble effect on hero
7. ⬜ Add magnetic buttons to CTAs
8. ⬜ Extract Services to `/services` page
9. ⬜ Build `/about` page with personality
10. ⬜ Add scroll-triggered text reveals

### Medium Term (Next Month)
11. ⬜ Build `/lab` experiments page
12. ⬜ Add SVG connector line to Method section
13. ⬜ Implement parallax on images
14. ⬜ Add `/now` page
15. ⬜ Consider `/writing` blog

### Long Term (Ongoing)
16. ⬜ Write case studies for each project
17. ⬜ Add more motion polish
18. ⬜ Build the AirDrop app
19. ⬜ Get real client work to feature
20. ⬜ Iterate based on feedback

---

## RESOURCES

### Sites to Bookmark & Study Regularly
- **rauno.me** — interaction reference
- **brittanychiang.com** — structure reference
- **joshwcomeau.com** — personality + writing reference
- **bymonolog.com** — typography scale reference
- **mainframe.co.uk** — editorial patterns reference
- **furo.studio** — process presentation reference
- **playfight.com** — layout + spacing reference
- **awwwards.com** — weekly inspiration
- **gallereee.com** — curated portfolios
- **wallofportfolios.in** — more portfolios

### Libraries to Install
```bash
npm install lenis gsap split-type
# Framer Motion already installed
```

### Files in This Repo (For Reference)
- `design-direction.md` — Core design constraints
- `personal-portfolio-direction.md` — Personal brand positioning
- `v3-real-site-analysis.md` — Monolog + Mainframe breakdown
- `v4-broad-inspiration-2026.md` — Broad research + positioning
- `v4-motion-inspo-update.md` — Motion patterns + priority list
- `cursor-prompt-v4.md` — Cursor IDE prompt for implementation
- `v5-massive-site-inspo-and-architecture.md` — THIS FILE

---

## CLOSING THOUGHT

Your site should make people feel something before they read a single word. The motion, the typography, the spacing — it should all whisper "this person knows what they're doing." Then when they DO read, they meet a 15-year-old who builds like someone twice his age.

That's the magic. That's what gets clients.

Now go build something stunning 🔥
