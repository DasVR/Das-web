# Portfolio Design Research — Cursor Prompt Reference

## User Identity
- Name: Arriq
- Business: Das Web Design
- Location: Largo, Florida
- Phone: (727) 507-1194
- Email: hello@dasdev.net
- Domain: dasdev.net
- Price Range: $500–$1,500
- Target: Local small businesses (plumbers, HVAC, restaurants, trades)

## Vibe Direction
Dark editorial + dot matrix/ASCII aesthetic + cinematic motion

## Top References (in order of user preference)
1. **furo.studio** — dot matrix hero text, neat layout, numbered sections (01-04), crosses as labels, orange accent
2. **bymonolog.com** — massive typography, dark bg, numbered sections, real client stats ($2M+, 58% increase), editorial
3. **mainframe.co.uk** — slash headers (/About, /Work), motion studio vibes
4. **A24 (a24films.com)** — cinematic, editorial, moody, minimal
5. **playfight.com** — scattered images, beautiful motion, scroll-driven
6. **seekanddeploy.com** — bold serif, dark bg, clean services list

## Sections Needed
- Hero with dot matrix ASCII/typography effect
- Selected Work (3+ real projects when available)
- The Method (01 Position, 02 Structure, 03 Build, 04 Launch)
- Services (Web Design, Branding, Development, SEO, Maintenance)
- Contact / CTA

## Colors
- Background: #0a0a0a (near black)
- Text: white / neutral-400 for secondary
- Accent: orange or white (user liked furo's orange accent)
- Borders: neutral-800 / neutral-900

## Typography
- Headings: Space Grotesk (geometric, bold)
- Body: Inter (clean, readable)
- Monospace numbers for section labels

## Motion
- Framer Motion for scroll reveals
- Staggered children animations
- Dot matrix flicker effect in hero
- Hover states on cards and service items

## Stack
- Next.js 14 App Router (static export)
- Tailwind CSS
- shadcn/ui (zinc base)
- Framer Motion
- Lucide React icons

## Live Site
- https://dasdev.net (root domain)
- https://portfolio.dasdev.net (subdomain)
- Deployed via Cloudflare Tunnel → Caddy → Docker container

## Current Status
v2 scaffolded and deployed. Needs:
- Real project screenshots (currently placeholders)
- Better copy/polish
- Mobile optimization
- Loading states
- SEO meta tags
- Performance optimization
