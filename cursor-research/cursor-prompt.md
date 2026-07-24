# Cursor IDE Prompt — Portfolio v3 Enhancement

## Project Context
This is a Next.js 14 portfolio site for "Arriq / Das Web Design" — a web designer in Largo, Florida serving small businesses ($500-$1,500 projects). The site is currently deployed at https://dasdev.net.

## Current Tech Stack
- Next.js 14 App Router with static export
- Tailwind CSS with custom dark theme
- shadcn/ui components
- Framer Motion for animations
- Lucide React icons
- Docker + Caddy + Cloudflare Tunnel deployment

## Design Direction (REFERENCES)
Study these sites for aesthetic direction:
1. furo.studio — dot matrix hero, numbered sections, cross/plus labels, orange accent
2. bymonolog.com — massive bold type, client results with real numbers, editorial layout
3. mainframe.co.uk — slash headers (/About, /Work), motion studio feel
4. a24films.com — cinematic, moody, editorial, minimal
5. playfight.com — scattered image grids, scroll-driven motion
6. seekdeploy.com — bold serif, dark bg, clean services list

## Current Issues to Fix
1. Hero dot matrix SVG placeholder needs REAL dot matrix animation (SVG or canvas)
2. Project cards are placeholders — need real screenshots when available, or better placeholder design
3. Copy needs to be more professional and specific
4. Missing loading states
5. Mobile needs optimization (text sizes, spacing)
6. SEO meta tags incomplete
7. No analytics / contact form functionality
8. Footer is too minimal

## Immediate Tasks (in priority order)

### 1. Hero Section Polish
- Implement a real dot matrix / ASCII text effect for "ARRIQ" using either:
  a) SVG pattern with animated circle opacity
  b) HTML5 canvas with randomized dot flicker
  c) CSS grid with staggered animation
- The text should feel "computational" and editorial, not gimmicky
- Reference: furo.studio hero

### 2. Project Cards (Selected Work)
- Replace solid color backgrounds with actual project screenshots
- If no real projects: use elegant dark gradient placeholders with project category icons
- Each card should show: Category | Project Name | Result metric
- Add "Coming Soon" state for placeholders
- Consider: hover reveals more info, click opens case study (even if minimal)

### 3. The Method Section
- Keep 01-04 structure but add subtle visual connectors between steps
- Maybe a vertical line or path animation linking 01→02→03→04
- Each step should have a small icon or visual marker

### 4. Services Section
- Current text-only list is fine but could be more interactive
- Consider: expandable service details on click, or hover preview
- Add pricing indication ("Starting at $500") to each service

### 5. Contact / Footer
- Expand footer with: social links, quick nav, copyright, built-with credits
- Add a simple contact form (Netlify Forms, Formspree, or just mailto)
- Consider adding Calendly or scheduling link

### 6. Global Polish
- Add smooth scroll behavior
- Add a custom cursor (optional, but fits the aesthetic)
- Add page transition animations
- Ensure all images have alt text
- Add Open Graph tags for social sharing
- Add favicon

## File Structure
```
src/
  app/
    page.tsx           — main landing page
    layout.tsx         — root layout with fonts + metadata
    globals.css        — tailwind + custom styles
    sections/
      Hero.tsx         — dot matrix hero
      Work.tsx         — selected work grid
      Method.tsx       — 01-04 process
      Services.tsx     — service list
      Contact.tsx      — contact + footer
  components/
    ui/                — shadcn components
    DotMatrix.tsx      — reusable dot matrix component
    AnimatedSection.tsx — scroll reveal wrapper
    ProjectCard.tsx    — work card component
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

## Deployment Notes
- `npm run build` outputs to `dist/`
- Dockerfile builds static site and serves via nginx
- Caddy reverse proxies from Cloudflare Tunnel
- To deploy: rebuild image, restart container, reload Caddy

## Research Files in cursor-research/
- design-direction.md — this file + overall direction
- portfolio-inspiration.md — saved inspiration links
- portfolio-research.md — research from galleries
- hit-list-largo.md — potential client list for outreach
- business-info.txt — business identity details
- dandrea-email-draft.txt — example cold email

## User's Long-Term Vision
- Build real client projects to fill the portfolio
- Offer maintenance packages
- Expand to branding + SEO
- Build an AI employee system for client acquisition

---
START WITH: Hero.tsx dot matrix implementation, then Work.tsx project cards.
