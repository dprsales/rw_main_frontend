import { mono, serif, text } from './theme'

/* The horizontal padding is the page gutter; `.rw-pad` steps it down by breakpoint - see global.css. */
export const container = { maxWidth: 1320, margin: '0 auto', padding: '0 40px' }

/* Section eyebrows / kickers, bumped to 15px to read as a label, not fine print.
 * Stat labels that want to stay small override fontSize inline. */
export const eyebrow = {
  fontFamily: mono, fontSize: 15, letterSpacing: '.22em', color: 'var(--copper)',
}

export const eyebrowFaded = { ...eyebrow, color: 'var(--faded)' }

export const statLabel = {
  fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--faded)', marginTop: 12,
}

/* DISPLAY TYPE - every headline shares the same serif/weight/tracking in
 * `display`; only size and leading change by role. One-offs spread the nearest rung and override fontSize/lineHeight. */
const display = { fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', color: 'var(--ink)' }

/** Page h1 on the interior pages (Coaching, Careers, Consulting, Realty). */
export const pageHeading = { ...display, fontSize: 'clamp(42px,5.6vw,84px)', lineHeight: 1.04 }

/** The largest section h2 - used where a section opens a page's second act. */
export const sectionHeadingLg = { ...display, fontSize: 'clamp(30px,4vw,52px)', lineHeight: 1 }

/** The standard section h2. */
export const sectionHeading = { ...display, fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: 1.04 }

/** A quieter section h2, for sections that sit under a larger one. */
export const sectionHeadingSm = { ...display, fontSize: 'clamp(26px,3.4vw,44px)', lineHeight: 1.04 }

export const closingHeading = {
  ...display, fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: 1.08,
  maxWidth: '16em', margin: '0 auto',
}

/* RUNNING TEXT */

export const body = {
  fontFamily: text, fontWeight: 300, fontSize: 'clamp(17px,1.8vw,20px)', lineHeight: 1.62, color: 'var(--faded)',
}

/** The copper standfirst that sits between an h1 and its intro paragraph. */
export const lede = {
  fontFamily: serif, fontWeight: 400, fontSize: 'clamp(19px,2.4vw,24px)', color: 'var(--copper)',
}

/** The intro paragraph under a page h1. */
export const intro = {
  fontFamily: text, fontWeight: 300, fontSize: 'clamp(17px,1.8vw,20px)', lineHeight: 1.55, color: 'var(--faded)',
}

/** Supporting copy at a fixed size - section asides, card descriptions. */
export const note = {
  fontFamily: text, fontWeight: 300, fontSize: 17, lineHeight: 1.55, color: 'var(--faded)',
}

/* CONTROLS - CTA padding shrinks with the viewport so it stays inside the
 * gutter on a small phone instead of breaking mid-label. */

/** Gold filled call-to-action, carrying the metallic sweep. Dark text keeps it read as clickable.
 * Height-locked to 48px with a normal 10px radius. The animated metallic rim lives on
 * `.rw-cta::before` in global.css so it matches the glass specular buttons. */
export const ctaCopper = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--gold-gradient)', color: '#16110a',
  fontFamily: mono, fontSize: 13, letterSpacing: '.1em',
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
  fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(17px,1.8vw,20px)', color: 'var(--ink)',
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
