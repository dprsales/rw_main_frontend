// Brand palette: black + gold. Gold (#C39B53) is the sole accent; `--copper` is the legacy
// variable name kept as the accent hook. Single cinematic art direction, applied unconditionally.
export const THEME = {
  '--bg': '#0B0A09',
  '--ink': '#F2EFE9',
  '--faded': '#9A9289',
  '--line': 'rgba(242,239,233,0.10)', // hairline rules; opacity is the only lever at 1px
  '--copper': '#C39B53',
  '--gold-gradient': 'linear-gradient(100deg, #A67C3D 0%, #E8C97A 48%, #C39B53 100%)', // sampled from the logo art
  '--chip': '#1A1714',
  '--card': '#141210',
  '--shadow': '0 20px 50px rgba(0,0,0,.55)',
  '--shadow-lift': '0 34px 80px rgba(0,0,0,.70)',
  '--logo-filter': 'grayscale(1) brightness(0) invert(1)', // flattens partner logos to one mark, avoids invisible dark wordmarks
}

// Two font families, three roles — both are loaded in index.html, don't name others here.
// `serif` (Cormorant Garamond): display headlines, names, titles, pull quotes.
// `mono` (Jost): eyebrows, nav, buttons, counters, tags — stays crisp at small sizes.
// `text` (Jost): body copy — serif turns faint/fussy at paragraph sizes, sans is the editorial pairing.
export const serif = "'Cormorant Garamond', 'Times New Roman', serif"
export const text = "'Jost', system-ui, -apple-system, sans-serif"
export const mono = "'Jost', system-ui, -apple-system, sans-serif"

export const EMAIL = 'mailto:connect@rajivwilliams.com'

// Primary number; use `label`/`href` from here, don't write either out by hand.
export const PHONE = { label: '+91 95495 46568', href: 'tel:+919549546568' }

// WhatsApp deep link; append `?text=…` at the call site for a prefilled message.
export const WHATSAPP = 'https://wa.me/+919549546568'

// Happening Hyderabad, linked to its LinkedIn company page.
export const HH_LINK = { label: 'Happening Hyderabad ↗', href: 'https://www.linkedin.com/company/hyderabad1st/', external: true, muted: true }

// Footer social profiles. No YouTube row yet — live site has no channel handle to link.
export const SOCIAL_LINKS = [
  { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/rajivwilliams/', external: true, muted: true },
  { label: 'Instagram ↗', href: 'https://www.instagram.com/williams_rajiv/', external: true, muted: true },
  { label: 'Facebook ↗', href: 'https://www.facebook.com/williamsrajiv', external: true, muted: true },
  { label: 'X ↗', href: 'https://x.com/RajivCWilliams', external: true, muted: true },
  { label: 'WhatsApp ↗', href: WHATSAPP, external: true, muted: true },
]

// FOOTERS — same contact block closes all pages; composed here so one edit updates everywhere.

const EMAIL_LINK = { label: 'connect@rajivwilliams.com', href: EMAIL }
const PHONE_LINK = { label: PHONE.label, href: PHONE.href, muted: true }

// Contact, then outbound profiles — every footer ends with this.
const FOOTER_CONTACT = [{ ...EMAIL_LINK, muted: true }, PHONE_LINK, HH_LINK, ...SOCIAL_LINKS]

// Interior pages — Coaching, Consulting, Realty, Careers, Portfolio.
export const FOOTER_LINKS = [{ label: '← Back to home', to: '/' }, ...FOOTER_CONTACT]

// Home has no "back to home" link; leads on email and points onward instead.
export const HOME_FOOTER_LINKS = [
  EMAIL_LINK, PHONE_LINK, HH_LINK, ...SOCIAL_LINKS,
  { label: 'RW Realty →', to: '/realty', muted: true },
  { label: 'Careers →', to: '/careers', muted: true },
]

// A project detail page goes back up its own branch, not to the home page.
export const PROJECT_FOOTER_LINKS = [
  { label: '← RW Realty', to: '/realty' },
  { label: 'Portfolio', to: '/realty/portfolio' },
  ...FOOTER_CONTACT,
]
