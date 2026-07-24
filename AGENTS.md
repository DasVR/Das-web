# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **Next.js 14 (App Router) static portfolio site** ("Arriq", package `portfolio-v2`). There is no backend, database, auth, API, or automated test suite — all content is hardcoded in `src/app/page.tsx`. Package manager is **npm** (`package-lock.json`).

Standard commands live in `package.json` scripts:
- Dev server: `npm run dev` → http://localhost:3000
- Lint: `npm run lint`
- Build (static export): `npm run build`

Non-obvious caveats:
- `next.config.js` sets `output: 'export'` with `distDir: 'dist'`, so `npm run build` writes a static export into `dist/` (which is committed). Running `npm run build` will regenerate/modify files under `dist/`; treat those as build artifacts and do not commit incidental changes unless intended. `npm run start` (`next start`) is not the intended prod path — production serves the static `dist/` via nginx (see `Dockerfile`).
- `npm run lint` / `next build` may auto-reformat `tsconfig.json` and add `dist/types/**/*.ts` to `include`. Revert that incidental change if it isn't intended.
- There is a duplicate/empty `next.config.mjs` alongside `next.config.js`; the `.js` file is the effective config.
- The `public/` folder is absent, so project image cards render as gradient placeholders — this is expected, not a bug.
