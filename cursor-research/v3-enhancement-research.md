# Portfolio v3 Enhancement Research — Motion, Typography, Effects

## GOAL
Make the dot matrix hero COOLER. Add more motion. More interactivity. More polish.
Everything should feel cinematic, editorial, and computational.

---

## 1. DOT MATRIX / ASCII TEXT EFFECTS

### Option A: Canvas-based Dot Matrix (RECOMMENDED)
- Use HTML5 Canvas to render text as a grid of dots
- Each dot is a circle that pulses/flickers with random timing
- On mouse hover near the text, dots "wake up" and glow brighter
- Reference: furo.studio hero, bymonolog.com massive type
- Implementation: Canvas 2D context, measureText() for layout, fill circles at grid positions

### Option B: CSS Grid Dot Matrix
- Render text as transparent, use CSS background-image with radial-gradient dots
- Animate opacity with CSS animation and staggered delays
- Simpler but less interactive than canvas

### Option C: Three.js Particle Text (MOST IMPACTFUL)
- Convert text to particles using TextGeometry or custom SDF
- Particles float, disperse on scroll, reform on hover
- Reference: https://tympanus.net/codrops/2020/06/02/kinetic-typography-with-three-js/
- Reference: https://tympanus.net/codrops/2022/11/08/3d-typing-effects-with-three-js/
- Requires Three.js + React Three Fiber
- PRO: insanely impressive, scroll-linked
- CON: heavier bundle, needs WebGL

### Option D: SVG Pattern Dot Matrix
- Use SVG `<pattern>` with circles, apply to text via `fill="url(#dots)"`
- Animate pattern transform or individual circle opacity
- Clean, scalable, lightweight
- Best middle ground between impact and performance

### Code Resources
- CodePen "Matrix rain animation": https://codepen.io/yaclive/pen/EayLYO
- CodePen "Connecting Dots": https://codepen.io/LeonGr/pen/yginI
- ASCII Motion tool: https://ascii-motion.app/
- ASCII Motion (alt): https://ascii-motion.com/
- Text to ASCII generator: https://ascii-magic.com/text-to-ascii

---

## 2. KINETIC TYPOGRAPHY & MOTION

### Scroll-Linked Text Effects
- Text characters reveal one by one as you scroll
- Words slide in from masked containers
- Line-by-line reveal with stagger
- Use Framer Motion `useScroll` + `useTransform`
- Reference: https://motion.dev/docs/react-scroll-animations
- Reference: https://www.joshwcomeau.com/animation/scroll-driven-animations/

### Mouse-Reactive Typography
- Text subtly follows cursor (parallax depth effect)
- Characters displace slightly based on mouse distance
- Reference: kinetic typography Three.js Codrops article

### Text Scramble / Decode Effect
- Text starts as random characters, decodes to real text
- Classic hacker/cinematic vibe
- Use setInterval to cycle characters until settling
- Library: `use-scramble` or custom implementation

---

## 3. SCROLL ANIMATIONS

### Framer Motion Scroll (already have, enhance it)
- `whileInView` with viewport margin for earlier trigger
- Stagger children: `transition: { staggerChildren: 0.1 }`
- Parallax layers: different scroll speeds for elements
- Use `useScroll` + `useTransform` for progress-based animations

### Specific Scroll Effects to Add
- **Hero parallax**: background elements move slower than foreground
- **Numbered sections**: 01, 02, 03, 04 animate in with a vertical line drawing
- **Project cards**: staggered reveal, slight scale up on scroll-in
- **Services**: each line slides in from left with slight rotation

### Resources
- Framer Motion Scroll Masterclass: https://www.youtube.com/watch?v=PczQ0qSwe1E
- CSS Scroll-Driven Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- Scroll-driven Animations gallery: https://scroll-driven-animations.style/

---

## 4. TEXTURE & ATMOSPHERE

### Noise / Grain Overlay
- Add subtle film grain via CSS/SVG noise filter
- `filter: url(#noise)` with an SVG feTurbulence
- Opacity 3-5%, mix-blend-mode: overlay or soft-light
- Reference: https://ibelick.com/blog/create-grainy-backgrounds-with-css
- Reference: https://css-tricks.com/grainy-gradients/
- This gives the "A24 cinematic" feel

### Scanlines / CRT Effect (optional)
- Very subtle horizontal lines, 1px, 5% opacity
- Could be cool for the terminal/dot matrix vibe
- Don't overdo it — subtlety is key

### Vignette
- Radial gradient from transparent center to dark edges
- Already subtle on current design, can enhance

---

## 5. CUSTOM CURSOR

### Options
- **Small circle cursor**: white dot, 8px, follows mouse with slight lag (lerp)
- **Text hover cursor**: expands to ring when hovering links/cards
- **Blend mode cursor**: mix-blend-mode: difference so it's always visible
- **Magnetic effect**: cursor snaps toward clickable elements

### Implementation
- Hide default cursor with `cursor: none`
- Track mouse position with requestAnimationFrame
- Use Framer Motion `useSpring` for smooth follow
- Reference: https://motion.dev/docs/cursor
- Reference: https://dribbble.com/search/interactive-cursor

---

## 6. INTERACTIVE BACKGROUND

### Particle Field (Canvas)
- Subtle floating dots/particles in the background
- Connect nearby particles with thin lines (constellation effect)
- React to mouse: particles move away from cursor
- Reference: https://codepen.io/LeonGr/pen/yginI
- Keep it subtle — 50 particles max, low opacity

### Grid Lines
- Faint horizontal/vertical grid lines that fade in on scroll
- Gives a "design blueprint" editorial feel
- Could overlay the entire page at 2% opacity

---

## 7. WEBGL EFFECTS (if going all out)

### Three.js + React Three Fiber
- **Particle text**: Text dissolves into particles on scroll
- **Wave distortion**: Subtle vertex displacement on scroll
- **Post-processing**: Bloom, noise, chromatic aberration for cinematic look
- Reference: https://tympanus.net/codrops/tag/webgl/
- Bundle size: +~150kb gzipped for Three.js basics

### Simpler WebGL
- **Shader background**: A dark animated noise/gradient in fragment shader
- Very lightweight, runs on GPU
- Can use `glslCanvas` or R3F

---

## 8. SECTION-SPECIFIC ENHANCEMENTS

### Hero
- Real dot matrix implementation (pick from section 1)
- Subtle particle field behind text
- Scroll indicator with animated arrow/chevron
- "LARGO, FL · EST 2026" could type out or decode

### Selected Work (Projects)
- **Horizontal scroll gallery** on desktop (optional)
- **Hover effect**: Image scales 1.02, overlay text slides up
- **Mask reveal**: Image reveals from center on scroll
- **Project count badge**: "3 Projects" with animated number

### The Method (01-04)
- **Vertical connecting line**: SVG line draws as you scroll
- **Step activation**: Active step glows, inactive steps dim
- **Icon per step**: minimal line icons (target, wireframe, code, rocket)

### Services
- **Expandable items**: Click to reveal description + pricing
- **Hover arrow**: Arrow slides in from left on hover
- **Count badge**: "5 services" animated

### Contact
- **Form fields**: Focus state with underline animation
- **Submit button**: Ripple effect on click
- **Social links**: Magnetic hover effect

---

## 9. PERFORMANCE NOTES

- Use `will-change: transform, opacity` on animated elements
- Prefer `transform` and `opacity` over layout-triggering properties
- Lazy load below-fold sections with `whileInView`
- Use `requestAnimationFrame` for canvas/mouse effects
- Add `prefers-reduced-motion` media query fallbacks
- WebGL effects: only render when visible (IntersectionObserver)

---

## 10. RECOMMENDED PRIORITY ORDER

1. **Dot Matrix Hero** — canvas or SVG implementation (biggest impact)
2. **Scroll animations polish** — stagger, parallax, reveal (makes site feel premium)
3. **Noise/grain texture** — instant cinematic feel, very easy
4. **Custom cursor** — small but makes everything feel interactive
5. **Kinetic text effects** — decode/scramble on load for hero text
6. **Background particles** — subtle depth without being distracting
7. **WebGL** — only if everything else is done and performance is good

---

## 11. LIBRARIES TO CONSIDER

- `framer-motion` — already using, more scroll/parallax features
- `three` / `@react-three/fiber` — WebGL particle text
- `gsap` + `ScrollTrigger` — more control than Framer for complex scroll
- `lenis` — smooth scroll (makes everything feel better)
- `react-bits` — text scramble, other effects

---

## 12. REFERENCES TO STUDY

- furo.studio — dot matrix hero, clean numbered sections
- bymonolog.com — massive type, real stats, editorial
- mainframe.co.uk — slash headers, motion feel
- A24 (a24films.com) — cinematic grain, moody
- playfight.com — scattered images, scroll motion
- seekdeploy.com — bold serif, services list
- https://tympanus.net/codrops/ — ALL the cutting edge web effects
- https://scroll-driven-animations.style/ — scroll animation examples

---

## USER REQUIREMENTS

- Dot matrix aesthetic (dots forming text)
- ASCII/terminal vibes
- Dark editorial + cinematic
- More motion, more interactive
- Professional but not corporate
- Built for small business clients in Largo FL
