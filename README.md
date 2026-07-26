# Das Web — Arriq portfolio

Personal portfolio, lab, and service site for Arriq / Das Web Design — [dasdev.net](https://dasdev.net).

Next.js 14 (App Router) exported as a static site, served by nginx behind Caddy and a Cloudflare Tunnel.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # static export → dist/
```

## Structure

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Home — hero, featured work, lab teaser, services preview, method, CTA |
| `src/app/work` | Full project list |
| `src/app/services` | Services accordion + method |
| `src/app/lab` | GitHub repos + interface studies |
| `src/app/about`, `src/app/now`, `src/app/contact` | Personal pages |
| `src/app/dashboard` | Client portal scaffold (login + workspace) |
| `src/app/sections` | Home/shared page sections |
| `src/components` | Chrome, motion primitives, cards |
| `src/lib` | Projects, services catalog, dashboard data, GitHub |
| `cursor-research/` | Design direction and research notes |

Global chrome (nav, grain, cursor, scroll progress, smooth scroll) lives once in
`src/app/layout.tsx` via `SiteChrome`. Pages render content only.

## Choosing which GitHub repos appear in the Lab

Edit `LAB_REPOS` in [`src/lib/github.ts`](src/lib/github.ts):

```ts
export const LAB_REPOS: LabRepoConfig[] = [
  {
    repo: "DasVR/RouteSim",   // owner/name
    title: "RouteSim",         // optional display name
    blurb: "Short description…", // optional — overrides GitHub's description
    featured: true,            // optional — pins to the front
  },
];
```

Repos are fetched from the GitHub REST API **at build time** and baked into the
static HTML, so visitors never call the API and there are no loading states.
Stars, forks, language, topics, last push, and a 26-week commit matrix come
straight from GitHub. Dormant repos simply omit the matrix.

If the API is unreachable or rate-limited, the build falls back to the `title`
and `blurb` in the config, so a build never fails.

### Optional: GITHUB_TOKEN

Unauthenticated builds get 60 requests/hour per IP, which covers roughly 30
repos per build. To lift that, export a token with `public_repo` scope before
building:

```bash
export GITHUB_TOKEN=ghp_…
npm run build
```

### Optional: NEXT_PUBLIC_FORMSPREE_ID

The contact form posts to Formspree when this is set; otherwise it opens a
prefilled mail draft to hello@dasdev.net.

## Deploy

`bash deploy.sh` pulls, installs, builds, rebuilds the Docker image, and
restarts the container. GitHub Actions triggers it via webhook.
