import { Link, useLocation } from 'react-router-dom'
import Credit from './Credit'
import Wordmark from './Wordmark'
import { mono, PAGE_SOCIAL_LINKS, SOCIAL_LINKS } from '../theme'

/** One glyph per platform, matched by label's first word. Simplified marks, not brand logos. */
const SOCIAL_ICONS = {
  LinkedIn: (
    <path d="M4 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM3 9h2v8H3V9Zm5 0h2v1.2c.5-.8 1.4-1.4 2.6-1.4 2 0 3.4 1.3 3.4 3.9V17h-2v-4.9c0-1.3-.6-2.1-1.8-2.1-1 0-1.8.7-2 1.6-.1.2-.1.5-.1.8V17H8V9Z" />
  ),
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="13" height="13" rx="3.5" />
      <circle cx="10" cy="10" r="3.2" />
      <circle cx="13.6" cy="6.4" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: (
    <path d="M12.5 3.5h-1.8C9 3.5 8 4.6 8 6.3v1.9H6V11h2v6h2.4v-6h2l.4-2.8h-2.4V6.6c0-.7.3-1.1 1.1-1.1h1.4V3.6Z" />
  ),
  X: <path d="M4 4l12 12M16 4 4 16" />,
  WhatsApp: (
    <path d="M10 3.5a6.5 6.5 0 0 0-5.6 9.8L3.5 16.5l3.3-.9A6.5 6.5 0 1 0 10 3.5Zm3.4 8.9c-.2.5-1 1-1.6 1.1-.4.1-1 .1-2.9-.6-2.3-1-3.8-3.4-3.9-3.5-.1-.2-.9-1.2-.9-2.3 0-1.1.6-1.6.8-1.8.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.7c.1.1.1.3 0 .4l-.3.4c-.1.1-.2.2-.1.4.2.3.7 1.1 1.4 1.7.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.5-.6c.2-.2.3-.2.5-.1l1.5.8c.2.1.3.2.3.3 0 .1 0 .5-.2 1Z" />
  ),
}

function socialIcon(label) {
  return SOCIAL_ICONS[label.split(' ')[0]]
}

const PLATFORM_NAMES = Object.keys(SOCIAL_ICONS)

/**
 * Outbound profiles as icon buttons, distinct from the contact row. The set swaps per
 * route (PAGE_SOCIAL_LINKS); pages without their own service fall back to personal profiles.
 */
function FooterSocialIcons() {
  const { pathname } = useLocation()
  const items = PAGE_SOCIAL_LINKS[pathname] || SOCIAL_LINKS

  return (
    <div className="rw-footer-social" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {items.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label.replace(' ↗', '')}
          className="rw-social-icon"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            {socialIcon(link.label)}
          </svg>
        </a>
      ))}
    </div>
  )
}

/** `links` items: { label, href } for external/mail, { label, to } for routes. */
export default function Footer({ links, chip = false }) {
  // Excluded by platform name, not href — PAGE_SOCIAL_LINKS overrides href per page.
  const restLinks = links.filter((link) => !PLATFORM_NAMES.includes(link.label.split(' ')[0]))

  return (
    <footer style={{ position: 'relative', borderTop: '1px solid var(--line)', background: chip ? 'var(--chip)' : undefined }}>
      <Credit />
      <div
        className="rw-pad"
        style={{
          maxWidth: 1320, margin: '0 auto', padding: '44px 40px',
          display: 'flex', flexDirection: 'column', gap: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Wordmark size={48} />
            <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.06em', color: 'var(--faded)' }}>
              © 2026 Rajiv Williams · Hyderabad · 500032
            </span>
          </div>

          <FooterSocialIcons />
        </div>

        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24 }}>
          {/* 12px links have an 18px hit area — .rw-footer-links pads it out on touch only. */}
          <div
            className="rw-footer-links"
            style={{
              display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap',
              fontFamily: mono, fontSize: 12, letterSpacing: '.04em',
            }}
          >
            {restLinks.map((link) =>
              link.to ? (
                <Link key={link.label} to={link.to} style={{ color: link.muted ? 'var(--faded)' : undefined }}>
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  style={{ color: link.muted ? 'var(--faded)' : undefined }}
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
