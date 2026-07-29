# Cursor IDE Prompt — Portfolio v5 (Multi-Page + Spring Physics Motion)

## Project Context
This is a Next.js 14 portfolio site for "Arriq / Das Web Design" — a personal website, portfolio, and service offering for small businesses. The site is deployed at https://dasdev.net.

**NOT a niche trades-only shop. NOT a faceless agency. This is a founder-led personal brand.**

**v5 Direction: Multi-page site with spring-physics motion, haptic nav, and premium feel.**

---

## Current Tech Stack
- Next.js 14 App Router with static export (`output: 'export'`)
- Tailwind CSS with custom dark theme (#0a0a0a base, orange-500 accent)
- shadcn/ui components
- Framer Motion (already installed)
- Lucide React icons
- Docker + Caddy + Cloudflare Tunnel deployment

---

## What Just Changed (v4 → v5)

### Multi-Page Architecture (SCAFFOLDED, needs polish)
New pages created:
- `/` (Home)
- `/work`
- `/about`
- `/contact`
- `/lab`
- `/now`
- `/review` — PUBLIC review page for client deliverables (see Review Links below)
- `/dashboard` — Client portal
- `/dashboard/login` — Client sign in / activation with PIN key
- `/admin` — Admin panel
- `/admin/clients/detail` — Single client page with projects, care plans, messages, files

---

## Client Review Links (NEW — v5.1)
A time-limited public review system for all project types (not just web design).

### Database Tables
- `project_reviews` — stores token, external_url, expires_at, active flag, project_id
- `review_feedback` — anonymous or named comments on a review link
- Enum `review_feedback_status`: `open | resolved | wontfix`

### Admin Flow
- Admin creates project → checkbox "Enable client review link"
- Optional custom review URL (staging site, Figma, Drive, etc.)
- Expiry picker: 3 / 7 / 14 / 30 days
- After creation, review link displayed with Copy + Deactivate buttons
- Existing projects show active/inactive review links on their card

### Public Flow
- Anyone with link visits `/review?token=xxx`
- Sees project name + preview URL
- Can leave feedback (name/email optional)
- Can view past feedback
- Link auto-expires; admin can manually deactivate

### Code Locations
- Public page: `src/app/review/page.tsx`
- Admin UI: `src/app/admin/clients/detail/AdminClientDetail.tsx` (NewProjectForm, ProjectReviews component)
- Client dashboard: `src/app/dashboard/DashboardContent.tsx` (shows review links with copy)
- Data layer: `src/lib/reviews.ts` (fetchReviewByToken, submitFeedback, fetchFeedback, createReviewLink, deactivateReviewLink, fetchProjectReviews)
- Types: `src/lib/database.types.ts` (ReviewFeedbackStatus, ProjectReviewRow, ReviewFeedbackRow)
- Edge functions: `supabase/functions/verify-access-key/` (PIN-based client activation, deployed and working)
- Migrations: `supabase/migrations/0007_project_reviews.sql`, `0009_review_feedback.sql`, `0010_review_rls.sql` (renumbered to avoid collision)

---

## Client Activation (PIN-based)
Replaces Supabase invite emails (which hit rate limits). Admin generates an access_key → texts it to client → client activates at `/dashboard/login` with email + key + password.
- Edge function: `verify-access-key` (deployed)
- Client table columns: `access_key text`, `access_key_created_at timestamptz`
- Key cleared on first successful activation
- RLS policies allow anonymous users to verify keys

---

## What Just Changed (v4 → v5)
- `template.tsx` with spring physics page transitions (Framer Motion `AnimatePresence` via `template.tsx`)
- `SiteNav.tsx` updated to use Next.js `Link` with `usePathname()` + `layoutId` animated underline
- All 5 new pages have `SiteNav`, `GrainOverlay`, `CustomCursor`, and section animations

**Still needed:**
- Home page needs to remove extracted sections (Work, About, Contact, Experiments) OR keep them as teasers with "View all →" links
- Mobile nav needs full implementation (currently just a hamburger button)
- Contact form needs backend API endpoint to actually send emails
- Nav haptic feedback needs enhancement (vibrate on all interactive elements)
- Page transition spring physics needs tuning to feel buttery

---

## Motion Direction: beUI Pro / kail_designs / saurra3h Vibe

**Reference sites to study (and emulate):**
- **https://pro.beui.dev/** — Spring physics motion library. Premium animated components. Dark + warm gradients. This is the VIBE.
- **rauno.me** — Interaction-first, physics-based hover responses
- **bymonolog.com** — Giant typography, scattered layouts, premium feel
- **mainframe.co.uk** — Slash headers, motion studio feel
- **joshwcomeau.com** — Playful cursor, strong personal voice

**The motion style we want:**
- Spring physics EVERYWHERE — no linear easing, always `type: "spring"` with `stiffness` and `damping`
- Page transitions feel like a native app — not a browser reload
- Buttons pull toward cursor (magnetic) with spring physics
- Nav underline glides between links with shared `layoutId`
- Text reveals are scroll-driven and staggered
- Cards have subtle hover lift + scale with spring
- Haptic feedback on mobile for every meaningful interaction
- Grain overlay stays — it's part of the brand now

---

## Priority Task Order

### 1. Fix Home Page Content (CRITICAL)
Home page currently has ALL sections inline (Work, Experiments, About, Services, Contact). Now that these have dedicated pages:

**Option A:** Keep Home as a "greatest hits" — show previews/teasers of each section with "View all →" links to their dedicated pages
**Option B:** Strip Home down to just Hero + brief highlights + CTAs linking to other pages

**RECOMMENDATION:** Option B — make Home a powerful landing page. Hero + 3 featured things + CTA. Keep it tight.

### 2. Contact Form Backend (HIGH)
The `/contact` page has a form that POSTs to `/api/contact`. Need to create the API route.

**Backend options:**
- **Formspree** (easiest): Sign up at formspree.io, get a form endpoint, change form action to their URL
- **Self-hosted** (if you want): Create `/app/api/contact/route.ts` using `nodemailer` to send via Gmail SMTP
  - Gmail: `arriqaalraee@gmail.com` with app password (stored in `pass show email/gmail-app-password`)
  - Send to: `hello@dasdev.net` (Cloudflare Email Routing forwards to Gmail)

**Suggested approach:** Start with Formspree for immediate functionality, then migrate to self-hosted later.

### 3. Spring Physics Page Transitions (HIGH)
`template.tsx` is already created with spring animation. TUNE IT:

```tsx
// Current — adjust these values
<motion.div
  initial={{ opacity: 0, y: 12, scale: 0.995 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 25,
    mass: 0.8,
  }}
>
```

**Tuning notes:**
- Lower stiffness = slower, more dramatic spring
- Higher damping = less bouncy
- Adjust mass for weight feel
- Try: `stiffness: 120, damping: 20, mass: 1` for a heavier, more premium feel
- Consider adding a slight exit animation too

### 4. Mobile Navigation (HIGH)
Current mobile nav is just a hamburger button with no functionality.

**Needs:**
- Full-screen overlay menu on mobile
- Giant typography links (inspired by monolog)
- Spring animation for open/close
- Haptic feedback on open/close + link tap
- Close button or tap-outside-to-close

### 5. Haptic Feedback Enhancement (MEDIUM)
Already has basic `navigator.vibrate(10)` on mobile menu button.

**Expand to:**
- All nav link taps
- CTA button presses
- Form submit
- Card hover (on mobile tap)
- Keep it subtle — 10-15ms light taps, not annoying buzzes

```typescript
const haptic = (pattern: number | number[] = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};
```

### 6. Nav Spring Underline Polish (MEDIUM)
Current `layoutId="activeNav"` underline is good but can be better:
- Add spring transition to the underline itself
- Consider making it an orange dot instead of a line (more subtle)
- Add hover preview — show underline on hover before click (like beUI Pro nav)

### 7. Home Hero Enhancements (MEDIUM)
- Text scramble on "ARRIQ" wordmark (already implemented in DotMatrix component)
- Magnetic buttons on CTAs (already have MagneticButton component — USE IT)
- Consider adding a subtle scroll indicator with spring animation
- The "BASED IN FLORIDA · WORKING WIDELY" text could have a typewriter effect

### 8. Lenis Smooth Scroll (MEDIUM)
Not yet installed. This is the foundation for premium motion.

```bash
npm install lenis
```

Then add to layout or a client component:
```typescript
import Lenis from "lenis";

useEffect(() => {
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return () => lenis.destroy();
}, []);
```

### 9. Service Expand Animation (MEDIUM)
Current services on home page have click-to-expand with CSS grid-rows. Upgrade to Framer Motion `animate` for height expansion with spring.

### 10. Work Page Enhancement (LOWER)
- Add filter tabs: "All / Personal / Client / Experiments"
- Consider a masonry or scattered layout (playfight.com style)
- Add hover parallax to project card images

---

## Files to Know

### New / Modified (v5)
- `src/app/template.tsx` — Page transition wrapper
- `src/app/work/page.tsx` — Work page
- `src/app/about/page.tsx` — About page
- `src/app/contact/page.tsx` — Contact page (has form)
- `src/app/lab/page.tsx` — Lab/Experiments page
- `src/app/now/page.tsx` — Now page
- `src/components/SiteNav.tsx` — Updated nav with Next.js Links

### Existing Components (already built)
- `src/components/SmoothScroll.tsx`
- `src/components/GrainOverlay.tsx`
- `src/components/CustomCursor.tsx`
- `src/components/DotMatrix.tsx`
- `src/components/MagneticButton.tsx`
- `src/components/TextScramble.tsx`
- `src/components/AmbientDots.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/SectionHeader.tsx`
- `src/components/ScrollReveal.tsx`

### Sections (on home page — may need restructuring)
- `src/app/sections/Hero.tsx`
- `src/app/sections/Work.tsx`
- `src/app/sections/Experiments.tsx`
- `src/app/sections/About.tsx`
- `src/app/sections/Contact.tsx`
- `src/app/sections/Services.tsx`
- `src/app/sections/Stats.tsx`
- `src/app/sections/CTA.tsx`
- `src/app/sections/Method.tsx`
- `src/app/sections/Gap.tsx`

### Lib
- `src/lib/projects.ts` — Project data

---

## Design Tokens (Keep Consistent)

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Accent | `orange-500` (#f97316) |
| Text Primary | `white` |
| Text Secondary | `neutral-300` |
| Text Muted | `neutral-400` |
| Text Dim | `neutral-500` |
| Border | `neutral-800` |
| Card BG | `neutral-950/40` |
| Font Display | Space Grotesk (variable: `--font-space`) |
| Font Body | Inter (variable: `--font-inter`) |
| Grain Opacity | `0.05` |

---

## Deployment Notes

- Build: `npm run build` → outputs to `dist/`
- Deploy: `bash deploy.sh` (rebuilds Docker image, restarts container)
- Auto-deploy: GitHub Actions → webhook → deploy script
- Current container: `arriq-portfolio-v2` on `proxy` network
- Caddy reverse proxy: `arriq.dasdev.net` → container:80

---

## Reference Documents

1. **`cursor-research/v5-massive-site-inspo-and-architecture.md`** — Full architecture, all inspo sites, personality layers, airdrop app idea
2. **`cursor-research/v4-broad-inspiration-2026.md`** — Broad research + positioning
3. **`cursor-research/v4-motion-inspo-update.md`** — Motion patterns with code snippets
4. **`cursor-research/personal-portfolio-direction.md`** — Personal brand positioning
5. **`cursor-research/design-direction.md`** — Core design constraints
6. **`cursor-research/cursor-prompt-v4.md`** — Previous prompt (for context)

---

## Copy Guidelines (Still Apply)

- **First person.** "I build..." not "We build..."
- **Honest.** No fake metrics. Real numbers only.
- **Founder-led.** "Arriq. 15. Building in public."
- **No jargon.** Small business owners don't know what "responsive design" means. Say "looks good on phones."
- **Age as an asset:** "15 years old. 3 years of building. Fast, modern tools, no bureaucracy."

---

## Spring Physics Quick Reference

When adding ANY animation, prefer spring over ease:

```typescript
// Good — spring
const spring = { type: "spring", stiffness: 120, damping: 20, mass: 1 };

// Better — heavier feel
const premiumSpring = { type: "spring", stiffness: 100, damping: 15, mass: 1.2 };

// Snappy — for small interactions
const snappySpring = { type: "spring", stiffness: 300, damping: 25 };
```

**Spring values to try:**
- Page transitions: `stiffness: 100, damping: 20, mass: 1`
- Nav underline: `stiffness: 300, damping: 30`
- Button hover: `stiffness: 400, damping: 25`
- Card hover: `stiffness: 200, damping: 20`
- Mobile menu: `stiffness: 150, damping: 18, mass: 1.1`

---

## START HERE

1. Read this prompt fully
2. Read `template.tsx` and `SiteNav.tsx` to understand current state
3. Decide on Home page approach (Option A or B above)
4. Set up contact form backend (Formspree recommended for speed)
5. Tune spring values in `template.tsx` until page transitions feel RIGHT
6. Build mobile navigation with spring animation + haptics
7. Add Lenis smooth scroll
8. Polish, polish, polish

Questions? Ask.
