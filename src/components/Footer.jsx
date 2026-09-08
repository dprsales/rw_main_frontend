import { Link } from 'react-router-dom'
import Credit from './Credit'
import Wordmark from './Wordmark'
import { mono } from '../theme'

/** `links` items: { label, href } for external/mail, { label, to } for routes. */
export default function Footer({ links, chip = false }) {
  return (
    <footer style={{ position: 'relative', borderTop: '1px solid var(--line)', background: chip ? 'var(--chip)' : undefined }}>
      <Credit />
      <div
        className="rw-pad"
        style={{
          maxWidth: 1320, margin: '0 auto', padding: '44px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Wordmark size={48} />
          <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.06em', color: 'var(--faded)' }}>
            © 2026 Rajiv Williams · Hyderabad · 500032 
          </span>
        </div>

        {/* .rw-footer-links pads the small hit area out on touch pointers only */}
        <div
          className="rw-footer-links"
          style={{
            display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap',
            fontFamily: mono, fontSize: 12, letterSpacing: '.04em',
          }}
        >
          {links.map((link) =>
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
    </footer>
  )
}
