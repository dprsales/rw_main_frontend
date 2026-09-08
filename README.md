# Rajiv Williams — React

React + Vite conversion of the five `.dc.html` design-component pages in `../pages`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

## Routes

| Route | Was |
| --- | --- |
| `/` | `Rajiv Williams Redesign.dc.html` |
| `/coaching` | `Coaching.dc.html` |
| `/consulting` | `Consulting.dc.html` |
| `/realty` | `RW Realty.dc.html` |
| `/realty/portfolio` | `RW Realty Portfolio.dc.html` |

Any unmatched path redirects to `/`. Because routing is client-side, a static host
needs a rewrite of all paths to `index.html` (Netlify `_redirects`, Vercel rewrites,
`try_files` on nginx).

## How the original maps over

The `.dc.html` pages ran on a bespoke runtime (`../runtime/support.js`) that gave
them `sc-for` loops, `sc-if` branches, `{{ }}` bindings, and a `DCLogic` class with
`renderVals()`. All of that is now ordinary React:

| Original | Now |
| --- | --- |
| `sc-for list="{{ items }}"` | `items.map(...)` |
| `sc-if value="{{ isA }}"` | `dir === 'a' ? <HeroEditorial/> : <HeroCinematic/>` |
| `renderVals()` return object | props and `src/data/content.js` |
| `[data-reveal]` + scroll polling | `<Reveal>` on an `IntersectionObserver` |
| `[data-count-to]` + `setInterval` | `<CountUp>` on `requestAnimationFrame` |
| `[data-mag]` pointer listeners | `useMagnetic()` |
| `[data-parallax]` on the hero | `useParallax()` |
| `[data-progress]` + `setInterval` | `<ScrollProgress>`, rAF-throttled |
| `applyTheme()` writing CSS vars | `<ThemeProvider>` |
| `x-import image-slot` | `<ImageSlot>` |
| `<a href="Coaching.dc.html">` | `<Link to="/coaching">` |

The scroll-driven work that the original ran on a 40ms `setInterval` is now either
observer-driven or throttled to animation frames, so nothing polls when the page is idle.

The light/dark art-direction switcher (`DIRECTION · A / B`) still lives on the home
page, but the theme now sits in context above the router, so a direction chosen on
the home page carries into the sub-pages instead of resetting.

## Images

`<ImageSlot>` renders a labelled placeholder until you give it a `src` — the two
hero portraits in `src/pages/Home.jsx` are the only slots. Drop files into `public/`
and pass `src="/portrait.jpg"`.

## Structure

```
src/
  components/   Reveal, CountUp, MagneticLink, ScrollProgress, Header, Footer,
                Marquee, RiseText, ImageSlot, ThemeProvider, DirectionSwitcher
  hooks/        useInView, useMagnetic, useParallax, useSmoothScroll
  pages/        Home, Coaching, Consulting, Realty, Portfolio
  data/         content.js — all page copy
  theme.js      colour tokens for both directions
  styles.js     shared inline-style fragments
  global.css    resets, keyframes, hover states, responsive collapse
```
# rw_main_frontend
# rw_main_frontend
