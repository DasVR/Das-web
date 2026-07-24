# Mobile Optimization & Native App Feel — Research & Implementation Guide

## What We Just Built

### 1. Directional Page Transitions (`template.tsx`)
- **Slide direction** based on route order — navigating forward slides in from right, backward slides from left
- **Spring physics** — `stiffness: 120, damping: 22, mass: 1` for buttery feel
- **Opacity fade** during slide for depth
- `AnimatePresence mode="wait"` prevents layout jank during transition

### 2. Loading Screen (`loading.tsx`)
- **Dot matrix ARRIQ** — pulsing dot grid animation (on-brand)
- **Progress bar** — thin orange line that fills and loops
- **Full-screen overlay** with `z-[100]` to cover everything
- **Subtle entrance** — scale + fade

### 3. 404 Page (`not-found.tsx`)
- **Giant 404** in `neutral-800` with spring scale entrance
- **Floating ambient dots** — subtle decoration
- **Two CTAs** — Back home + View work
- **Grain overlay** for texture

### 4. Mobile Navigation
- **Full-screen overlay** — dark with `backdrop-blur-xl`
- **Giant typography** — `text-4xl` display font, monolog-style
- **Spring stagger** — links enter with staggered delay
- **Hamburger → X animation** — spring rotation on lines
- **Body scroll lock** — prevents scrolling behind menu
- **Active dot indicator** — orange dot on current page
- **Close button** at bottom

### 5. Mobile Haptics
- **Nav toggle** — light tap (12ms on open, 8ms on close)
- **Link taps** — 8ms light feedback
- **Touch targets** — minimum 44px for all interactive elements

---

## Mobile Features to Add (Research)

### Immediate (Low Effort, High Impact)

1. **Touch target sizing**
   - All buttons/links must be at least `min-h-[44px] min-w-[44px]`
   - Add padding around small tap targets
   - Use `touch-manipulation` CSS class

2. **Tap highlight removal**
   ```css
   * { -webkit-tap-highlight-color: transparent; }
   ```

3. **Active states for touch**
   - `:active` pseudo-class for immediate feedback
   - `whileTap={{ scale: 0.97 }}` on Framer Motion buttons
   - Visual feedback on all interactive elements

4. **Prevent zoom on input focus**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
   ```

5. **Safe area insets**
   ```css
   padding-top: env(safe-area-inset-top);
   padding-bottom: env(safe-area-inset-bottom);
   ```

### Medium (Good Polish)

6. **Pull-to-refresh visual**
   - Spring-based pull indicator
   - Arrow that rotates as you pull
   - Trigger at threshold (e.g., 80px)

7. **Swipe gestures**
   - Swipe left/right on cards (project gallery)
   - Swipe down to close modals/overlays
   - Edge swipe for back navigation

8. **Bottom sheet for CTAs**
   - Instead of inline buttons, use bottom sheet on mobile
   - Spring slide-up animation
   - Backdrop tap to dismiss

9. **Skeleton screens**
   - Show placeholder shapes while content loads
   - Shimmer animation (sweeping gradient)
   - Prevents layout shift

10. **Toast notifications**
    - Slide in from top or bottom
    - Auto-dismiss with progress bar
    - Spring animation

### Advanced (Native Feel)

11. **Page transition swipe**
    - Detect edge swipe to go back
    - Show peek of previous page
    - Spring-based snap to complete or cancel

12. **Overscroll physics**
    - Custom overscroll bounce at top/bottom
    - Spring-based resistance

13. **Momentum scrolling**
    - Already handled by browser, but Lenis smooth scroll enhances it
    - `overflow-y: scroll; -webkit-overflow-scrolling: touch;`

14. **Reduced motion respect**
    - Already partially implemented with `useReducedMotion`
    - Expand to ALL animations (loading, transitions, haptics)
    - Static fallbacks for everything

15. **PWA features**
    - `manifest.json` for add-to-home-screen
    - Service worker for offline loading
    - Icons in all sizes

---

## Recommended Spring Values for Mobile

| Interaction | Stiffness | Damping | Mass | Feel |
|-------------|-----------|---------|------|------|
| Page transition | 120 | 22 | 1 | Smooth, app-like |
| Nav menu open | 150 | 18 | 1.1 | Snappy but weighty |
| Nav menu close | 200 | 25 | 1 | Quick dismiss |
| Link stagger | 200 | 22 | 0.8 | Light, airy |
| Button tap | 400 | 25 | 0.5 | Instant feedback |
| Bottom sheet | 100 | 15 | 1.2 | Heavy, premium |
| Card swipe | 80 | 12 | 1 | Loose, playful |
| Toast enter | 300 | 25 | 0.6 | Quick pop |
| Toast exit | 250 | 20 | 0.5 | Snappy dismiss |

---

## Viewport Meta Tag (Critical)

Update `layout.tsx` to include:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
```

This prevents:
- Zoom on input focus (iOS Safari)
- Landscape zoom issues
- Safe area notch problems

---

## CSS Utilities to Add

```css
@layer utilities {
  .touch-manipulation {
    touch-action: manipulation;
  }
  .tap-highlight-none {
    -webkit-tap-highlight-color: transparent;
  }
  .overscroll-none {
    overscroll-behavior: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Testing Checklist

- [ ] All buttons ≥ 44×44px tap target
- [ ] No double-tap zoom issues
- [ ] Scroll works smoothly (no lag)
- [ ] Menu opens/closes smoothly
- [ ] Haptic feedback feels good (not annoying)
- [ ] Reduced motion mode works
- [ ] Landscape mode looks good
- [ ] Safe areas respected (notch, home bar)
- [ ] No horizontal scroll
- [ ] Font sizes readable (minimum 16px for inputs)
- [ ] Images don't overflow viewport
- [ ] Forms work with on-screen keyboard
- [ ] Footer accessible without scroll issues

---

## Files Modified/Created

- `src/app/template.tsx` — Directional page transitions
- `src/app/loading.tsx` — Loading screen
- `src/app/not-found.tsx` — 404 page
- `src/components/SiteNav.tsx` — Mobile nav with haptics
- `src/components/MobileFeatures.tsx` — Mobile utilities
- `src/app/globals.css` — Add touch utilities

---

## Next Steps

1. ✅ Page transitions — DONE
2. ✅ Loading screen — DONE
3. ✅ 404 page — DONE
4. ✅ Mobile nav — DONE
5. 🔄 Add viewport meta tag to layout
6. 🔄 Add touch utilities to globals.css
7. 🔄 Add safe area insets to layout
8. 🔄 Test on actual mobile device
9. 🔄 Add reduced motion fallbacks
10. 🔄 Consider PWA manifest
