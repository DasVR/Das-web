# Portfolio Build Plan — Arriq

## Stack
- **Framework**: Next.js 14 App Router (static export)
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui (zinc base)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (body) + Space Grotesk (display)
- **Deploy**: Docker nginx on server → dasdev.net

## Project Structure
```
portfolio-v2/
├── src/
│   ├── app/
│   │   ├── page.tsx          # main landing
│   │   ├── layout.tsx        # fonts + metadata
│   │   ├── globals.css       # dark theme
│   │   └── sections/
│   │       ├── Hero.tsx      # dot matrix + headline
│   │       ├── Work.tsx      # project grid
│   │       ├── Method.tsx    # 01-04 steps
│   │       ├── Services.tsx  # list with arrows
│   │       └── Contact.tsx   # email + phone + footer
│   └── components/
│       ├── DotMatrix.tsx     # animated dot text
│       └── SectionHeader.tsx # cross + label
├── public/
│   └── projects/             # project screenshots
├── next.config.js            # static export
├── Dockerfile                # multi-stage build
└── nginx.conf                # spa routing
```

## Sections Breakdown

### 1. Hero
- Dot matrix "ARRIQ" text (animated flickering dots)
- Headline: "Websites that speak your brand's voice"
- Subhead: web design for small businesses in Largo
- Two CTAs: "View Work" + "Start a Project"
- Top left: "LARGO, FL · EST 2026"
- Bottom: "+ Scroll to explore"

### 2. Selected Work
- Section header: cross icon + "Selected Work"
- 3 project cards (placeholder images for now)
- Each card: image, tag, name, stat
- Hover: arrow icon appears

### 3. Method (01-04)
- Section header: cross icon + "The Method"
- 4 steps with big numbers:
  - 01 Position — brand direction
  - 02 Structure — wireframes
  - 03 Build — design + dev
  - 04 Launch — deploy + support

### 4. Services
- Section header: cross icon + "Services"
- 5 service rows with hover arrow:
  - Web Design
  - Branding
  - Development
  - SEO
  - Maintenance

### 5. Contact + Footer
- Section header: cross icon + "Contact"
- "Ready when you are."
- Email: hello@dasdev.net
- Phone: (727) 507-1194
- Footer: © 2026 + stack credits

## Design Tokens
- Background: #0a0a0a
- Text: #ffffff
- Muted text: #a3a3a3 (neutral-400)
- Borders: #262626 (neutral-900)
- Accent: white (keep it clean)
- Border radius: 0.5rem on cards

## What We Need
1. Real project images (or good placeholders)
2. Final copy for headline/subhead
3. 3 real projects to showcase (even if they're fake/demo)
4. Domain: dasdev.net A record to server IP

## Deploy Steps
1. Build static export
2. Docker multi-stage build (node → nginx)
3. Add to docker-compose at /opt/stacks/foundation/
4. Caddy reverse proxy: dasdev.net → container:80
5. Cloudflare DNS A record → server IP

## Current Status
- ✅ Next.js scaffolded
- ✅ shadcn/ui initialized
- ✅ Framer Motion + Lucide installed
- ✅ All sections coded
- ✅ Build succeeds (static export)
- ✅ Dockerfile + nginx.conf written
- ❌ Need to: build image, add to compose, deploy
