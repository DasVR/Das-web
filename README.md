# Das-web

Personal portfolio website.

## Current direction

This branch rebuilds the site in Next.js around a dark liminal terminal aesthetic:

- boot sequence overlay
- matrix rain canvas
- CRT scanlines and vignette
- ASCII hero treatment
- refractive liquid-glass terminal cards
- floating vinyl playlist rail
- collapsible command terminal
- reduced-motion and text fallback modes

## Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## GitHub Pages

This project is configured for static export and GitHub Pages:

```bash
npm run build:pages
```

Live site: [https://dasvr.github.io/Das-web/](https://dasvr.github.io/Das-web/)

Deployment runs automatically via `.github/workflows/deploy-pages.yml` on push.
