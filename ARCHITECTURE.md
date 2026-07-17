# Overgrown Ruin Architecture

## Direction

The site is composed as a quiet, hopeful ruin rather than a game-themed fan page.
Its visual language comes from nature reclaiming human spaces: warm light, old
glass, moss, weathered signs, dust, and generous negative space.

## Layers

1. `PortfolioShell` owns the page structure, minimal navigation, and editorial
   work/about/contact sections.
2. `HeroSection` creates the primary photographic composition: typography on the
   left and a broken, refractive window study on the right.
3. `DustField` uses the shared Tempus frame loop for a single low-cost ambient
   canvas.
4. `Vine` supplies scalable SVG growth details. Motion is CSS-only and disabled
   by reduced-motion preferences.
5. `FadedAscii` preserves strong ASCII as an artifact inside the world—not as an
   interface convention.
6. `SvgFilterDefs` supplies the gentle displacement used by the hero window.

## Performance rules

- One shared animation frame loop.
- No 3D engine or large image payload in the initial hero.
- CSS/SVG scenery remains responsive without asset downloads.
- Refraction is limited to the hero focal surface.
- Reduced-motion and reduced-transparency preferences receive static fallbacks.

## Next sections

- Add project photography as AVIF/WebP with art-directed crops.
- Introduce scroll-linked plant growth only at section transitions.
- Use dither/ASCII processing on selected images, never on every surface.
- Keep navigation and content semantic, quiet, and keyboard accessible.
