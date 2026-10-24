/* Rajiv Williams brand palette: black and gold. Gold #C39B53 is the sole
 * accent; neutrals are warmed slightly toward it rather than left dead grey.
 * The historic `--copper` variable name is retained as the accent hook. */
/* One art direction: cinematic. Tokens apply unconditionally, not switched at runtime. */
export const THEME = {
  '--bg': '#0B0A09',
  '--ink': '#F2EFE9',
  '--faded': '#9A9289',
  /* Section rules at 1px, so opacity is the only lever to read as hairline not border. */
  '--line': 'rgba(242,239,233,0.10)',
  '--copper': '#C39B53',
  /* Metallic sweep for headlines/CTAs, sampled from the gold logo art. */
  '--gold-gradient': 'linear-gradient(100deg, #A67C3D 0%, #E8C97A 48%, #C39B53 100%)',
  '--chip': '#1A1714',
  '--card': '#141210',
  /* Near-black ground swallows a soft shadow, so it goes deeper and wider. */
  '--shadow': '0 20px 50px rgba(0,0,0,.55)',
  '--shadow-lift': '0 34px 80px rgba(0,0,0,.70)',
  /* Partner logos flattened to a single mark; inverted, or dark wordmarks vanish into the background. */
  '--logo-filter': 'grayscale(1) brightness(0) invert(1)',
}

/* Faces loaded in fonts.css - never name a family here the page doesn't fetch.
 * `serif` (Cormorant Garamond) - display headlines and featured pull-quotes.
 * `jost` (Jost Book) - brand sans for reading copy (quotes, card body).
 * `mono` (Poppins) - eyebrows, nav, buttons, counters, tags.
 * `text` (Poppins) - site body, cards, and lists. */
export const serif = "'Cormorant Garamond', 'Times New Roman', serif"
export const jost = "'Jost', system-ui, -apple-system, sans-serif"
export const text = "'Poppins', system-ui, -apple-system, sans-serif"
export const mono = "'Poppins', system-ui, -apple-system, sans-serif"

export const EMAIL = 'mailto:connect@rajivwilliams.com'

/* The primary number - `label` is the display form, `href` the dial form. */
export const PHONE = { label: '+91 95495 46568', href: 'tel:+919549546568' }

/* WhatsApp deep link on the primary number. Append `?text=…` for a prefilled message. */
export const WHATSAPP = 'https://wa.me/+919549546568'

/* HH - Happening Hyderabad, linked out to its LinkedIn company page. */
export const HH_LINK = { label: 'Happening Hyderabad ↗', href: 'https://www.linkedin.com/company/hyderabad1st/', external: true, muted: true }

/* Social profiles shown in every footer. No YouTube row yet - the live site has no channel handle to point at. */
export const SOCIAL_LINKS = [
  { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/rajivwilliams/', external: true, muted: true },
  { label: 'Instagram ↗', href: 'https://www.instagram.com/williams_rajiv/', external: true, muted: true },
  { label: 'Facebook ↗', href: 'https://www.facebook.com/williamsrajiv', external: true, muted: true },
  { label: 'X ↗', href: 'https://x.com/RajivCWilliams', external: true, muted: true },
  { label: 'WhatsApp ↗', href: WHATSAPP, external: true, muted: true },
]

/**
 * Optional per-route social accounts. Footer.jsx uses SOCIAL_LINKS unless a
 * pathname is listed here with real profile URLs. Never put '#' here — that
 * left inner-page footer icons as dead hash links.
 */
export const PAGE_SOCIAL_LINKS = {}

/* FOOTERS - the same contact block closes all seven pages; only the back-link
 * and trailing cross-links differ. Composed here so a changed number is one edit, not seven. */

const EMAIL_LINK = { label: 'connect@rajivwilliams.com', href: EMAIL }
const PHONE_LINK = { label: PHONE.label, href: PHONE.href, muted: true }

/** Contact, then the outbound profiles. Every footer ends with this. */
const FOOTER_CONTACT = [{ ...EMAIL_LINK, muted: true }, PHONE_LINK, HH_LINK, ...SOCIAL_LINKS]

/** Legal pages. Real routes, never hash placeholders. */
const LEGAL_LINKS = [
  { label: 'FAQs', to: '/faqs', muted: true },
  { label: 'Privacy Policy', to: '/privacy-policy', muted: true, legal: true },
  { label: 'Terms of Use', to: '/terms', muted: true, legal: true },
]

/** The interior pages - Coaching, Consulting, Realty, Careers, Portfolio. */
export const FOOTER_LINKS = [{ label: '← Back to home', to: '/' }, ...FOOTER_CONTACT, ...LEGAL_LINKS]

/** Home has no "back to home"; it leads on the email and points onward instead. */
export const HOME_FOOTER_LINKS = [
  EMAIL_LINK, PHONE_LINK, HH_LINK, ...SOCIAL_LINKS,
  { label: 'RW Realty →', to: '/realty', muted: true },
  { label: 'Careers →', to: '/careers', muted: true },
  { label: 'Channel Partners →', to: '/partner', muted: true },
  ...LEGAL_LINKS,
]

/** A project detail page goes back to the Hyderabad projects list. */
export const PROJECT_FOOTER_LINKS = [
  { label: '← Projects in Hyderabad', to: '/project-hyderabad' },
  { label: 'Portfolio', to: '/realty/portfolio' },
  ...FOOTER_CONTACT,
  ...LEGAL_LINKS,
]
