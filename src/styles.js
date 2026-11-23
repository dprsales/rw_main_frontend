import { mono, serif, text } from './theme'

/* Wraps a font-size so the site-wide text-size control (FontSizeControl) can scale it.
 * `--rw-fs` is the multiplier (1 by default; the control raises it).
 * `--rw-te` shrinks Telugu (set on html[lang="te"]) so Indic glyphs match Latin visual weight.
 * Pass a full length — a px string or a clamp() — since calc(number * length) needs a unit.
 * e.g. fs('clamp(28px,3.6vw,46px)') or fs('17px'). */
export const fs = (size) => `calc(var(--rw-fs, 1) * var(--rw-te, 1) * ${size})`

/* The horizontal padding is the page gutter; `.rw-pad` steps it down by breakpoint - see global.css. */
export const container = { maxWidth: 1320, margin: '0 auto', padding: '0 40px' }

/* Section eyebrows / kickers, bumped to 15px to read as a label, not fine print.
 * Stat labels that want to stay small override fontSize inline. */
export const eyebrow = {
  fontFamily: mono, fontSize: fs('15px'), letterSpacing: '.22em', color: 'var(--copper)',
}

export const eyebrowFaded = { ...eyebrow, color: 'var(--faded)' }

export const statLabel = {
  fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--faded)', marginTop: 12,
}

/* DISPLAY TYPE: three rungs only. Same serif/weight/tracking; size marks the role.
 * Do not override fontSize on these at call sites. Dual-tone (ink + copper italic)
 * is composition inside the node, not a fourth size.
 *
 *   H1 pageHeading     : one per page (PageIntro / page hero)
 *   H2 sectionHeading  : every section title (SectionHead, Reveal as="h2")
 *   H3 blockHeading    : in-section titles (cards, columns, list heads)
 */
const display = { fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', color: 'var(--ink)' }

/** H1: page title. */
export const pageHeading = { ...display, fontSize: fs('clamp(42px,5.6vw,84px)'), lineHeight: 1.04 }

/** H2: section title. One size site-wide so the eye learns the pattern. */
export const sectionHeading = { ...display, fontSize: fs('clamp(28px,3.6vw,46px)'), lineHeight: 1.04 }

/** @deprecated Use sectionHeading. Kept as an alias so old imports keep working. */
export const sectionHeadingLg = sectionHeading

/** @deprecated Use sectionHeading. Kept as an alias so old imports keep working. */
export const sectionHeadingSm = sectionHeading

/** H3: block / card / column title under an H2 section. */
export const blockHeading = { ...display, fontSize: fs('clamp(22px,2.4vw,30px)'), lineHeight: 1.15 }

export const closingHeading = {
  ...sectionHeading, lineHeight: 1.08,
  maxWidth: '16em', margin: '0 auto',
}

/* RUNNING TEXT */

export const body = {
  fontFamily: text, fontWeight: 400, fontSize: fs('clamp(17px,1.8vw,20px)'), lineHeight: 1.62, color: 'var(--faded)',
}

/** The copper standfirst that sits between an h1 and its intro paragraph. */
export const lede = {
  fontFamily: serif, fontWeight: 400, fontSize: fs('clamp(19px,2.4vw,24px)'), color: 'var(--copper)',
}

/** The intro paragraph under a page h1. */
export const intro = {
  fontFamily: text, fontWeight: 400, fontSize: fs('clamp(17px,1.8vw,20px)'), lineHeight: 1.55, color: 'var(--faded)',
}

/** Supporting copy at a fixed size - section asides, card descriptions. */
export const note = {
  fontFamily: text, fontWeight: 400, fontSize: fs('17px'), lineHeight: 1.55, color: 'var(--faded)',
}

/* CONTROLS - CTA padding shrinks with the viewport so it stays inside the
 * gutter on a small phone instead of breaking mid-label. */

/** Gold filled call-to-action, carrying the metallic sweep. Dark text keeps it read as clickable.
 * Height-locked to 48px with a normal 10px radius. The animated metallic rim lives on
 * `.rw-cta::before` in global.css so it matches the glass specular buttons. */
export const ctaCopper = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--gold-gradient)', color: '#16110a',
  fontFamily: mono, fontSize: 13, fontWeight: 500, letterSpacing: '.1em',
  height: 48, padding: '0 clamp(22px,3vw,32px)', whiteSpace: 'nowrap', boxSizing: 'border-box',
  borderRadius: 10, border: '0 solid transparent',
}

/** Ink filled call-to-action, used at the foot of each page. */
export const ctaInk = {
  display: 'inline-block', background: 'var(--ink)', color: 'var(--bg)',
  fontFamily: mono, fontSize: 13, letterSpacing: '.12em',
  padding: 'clamp(16px,2vw,20px) clamp(22px,3.4vw,34px)', borderRadius: 2,
}

/** The smaller ink button that closes a card (a programme, a job role). */
export const ctaCard = {
  display: 'inline-block', textAlign: 'center', background: 'var(--ink)', color: 'var(--bg)',
  fontFamily: mono, fontSize: 12, letterSpacing: '.1em', padding: '15px 26px', borderRadius: 2,
}

/** The bare "Explore x →" text button that sits beside a filled CTA. */
export const ctaInline = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: serif, fontStyle: 'italic', fontSize: fs('clamp(17px,1.8vw,20px)'), color: 'var(--ink)',
}

/** The "VIEW FULL PORTFOLIO →" style link that trails a section heading. */
export const headLink = {
  fontFamily: mono, fontSize: 12, letterSpacing: '.12em', color: 'var(--ink)',
}

/** A name under a pull quote. */
export const attribution = {
  fontFamily: mono, fontSize: 12, letterSpacing: '.16em', color: 'var(--copper)',
}

export const sectionRule = { borderTop: '1px solid var(--line)' }
