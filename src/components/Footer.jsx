import { Link, useLocation } from 'react-router-dom'
import Wordmark from './Wordmark'
import { BookButton } from './BookingModal'
import { useLang } from '../i18n/LangProvider'
import { FOOTER_LABEL_KEYS } from '../i18n/chrome'
import { EMAIL, PAGE_SOCIAL_LINKS, PHONE, SOCIAL_LINKS, WHATSAPP } from '../theme'

function Icon({ children, size = 14 }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}

/** One glyph per platform, matched by label's first word. Simplified marks, not brand logos. */
const SOCIAL_ICONS = {
  LinkedIn: (
    <Icon size={15}>
      <path d="M4 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" stroke="none" />
      <path d="M3 9h2v8H3V9Zm5 0h2v1.2c.5-.8 1.4-1.4 2.6-1.4 2 0 3.4 1.3 3.4 3.9V17h-2v-4.9c0-1.3-.6-2.1-1.8-2.1-1 0-1.8.7-2 1.6-.1.2-.1.5-.1.8V17H8V9Z" fill="currentColor" stroke="none" />
    </Icon>
  ),
  Instagram: (
    <Icon size={15}>
      <rect x="3.5" y="3.5" width="13" height="13" rx="3.5" />
      <circle cx="10" cy="10" r="3.2" />
      <circle cx="13.6" cy="6.4" r=".9" fill="currentColor" stroke="none" />
    </Icon>
  ),
  Facebook: (
    <Icon size={15}>
      <path d="M12.5 3.5h-1.8C9 3.5 8 4.6 8 6.3v1.9H6V11h2v6h2.4v-6h2l.4-2.8h-2.4V6.6c0-.7.3-1.1 1.1-1.1h1.4V3.5Z" fill="currentColor" stroke="none" />
    </Icon>
  ),
  X: (
    <Icon size={15}>
      <path d="M4.2 4.2 15.8 15.8M15.8 4.2 4.2 15.8" />
    </Icon>
  ),
  WhatsApp: (
    <Icon size={15}>
      <path d="M10 3.5a6.5 6.5 0 0 0-5.6 9.8L3.5 16.5l3.3-.9A6.5 6.5 0 1 0 10 3.5Z" />
      <path d="M7.4 8.2c.1-.3.3-.3.4-.3h.4c.1 0 .3 0 .4.3l.6 1.5c.1.2 0 .3-.1.4l-.3.3c-.1.1-.1.3 0 .4.3.5.9 1.2 1.6 1.6.3.2.5.2.6.1l.4-.4c.1-.1.3-.1.4 0l1.3.7c.2.1.3.2.3.4 0 .2-.1.7-.4 1-.2.3-.8.6-1.3.6-.5 0-1.1-.1-2.7-.8-1.9-.8-3.2-2.9-3.3-3.1-.1-.2-.8-1-.8-1.9 0-.8.4-1.2.6-1.4Z" fill="currentColor" stroke="none" />
    </Icon>
  ),
}

function socialIcon(label) {
  return SOCIAL_ICONS[label.split(' ')[0]]
}

const ICONS = {
  coaching: (
    <Icon>
      <path d="M3.5 8.2 10 4.5l6.5 3.7-6.5 3.7L3.5 8.2Z" />
      <path d="M6.2 9.7v3.2c0 .7 1.6 1.8 3.8 1.8s3.8-1.1 3.8-1.8V9.7" />
      <path d="M16.5 8.5v4.2" />
    </Icon>
  ),
  consulting: (
    <Icon>
      <rect x="4" y="3.5" width="12" height="13" rx="1.4" />
      <path d="M7 7.5h6M7 10.5h6M7 13.5h4" />
    </Icon>
  ),
  mandate: (
    <Icon>
      <circle cx="7.2" cy="10" r="3.1" />
      <path d="M10.2 10h6.3M14.2 10v2.4M16.5 10v2.4" />
    </Icon>
  ),
  projects: (
    <Icon>
      <path d="M3.5 16.5h13" />
      <path d="M5 16.5V7.2l5-2.7 5 2.7v9.3" />
      <path d="M8 16.5v-3.2h4v3.2M8.5 9h1M10.5 9h1M8.5 11.5h1M10.5 11.5h1" />
    </Icon>
  ),
  market: (
    <Icon>
      <path d="M3.8 9.2 10 4.2l6.2 5" />
      <path d="M5.5 8.5V16h9V8.5" />
      <path d="M8.2 16v-3.6h3.6V16" />
    </Icon>
  ),
  about: (
    <Icon>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 9v4.2M10 6.6h.01" />
    </Icon>
  ),
  careers: (
    <Icon>
      <rect x="3.5" y="7" width="13" height="9" rx="1.4" />
      <path d="M7 7V5.8A1.8 1.8 0 0 1 8.8 4h2.4A1.8 1.8 0 0 1 13 5.8V7M3.5 10.5h13" />
    </Icon>
  ),
  partners: (
    <Icon>
      <circle cx="7" cy="7" r="2.2" />
      <circle cx="13.2" cy="7" r="2.2" />
      <path d="M3.5 15.5c.5-2 2-3.1 3.5-3.1s3 1.1 3.5 3.1M9.5 15.5c.5-2 2-3.1 3.7-3.1s3 1.1 3.5 3.1" />
    </Icon>
  ),
  vendor: (
    <Icon>
      <path d="M4 8.2 5.2 4.5h9.6L16 8.2" />
      <path d="M4 8.2h12v7.3H4V8.2Z" />
      <path d="M8.2 11.5h3.6" />
    </Icon>
  ),
  library: (
    <Icon>
      <path d="M4.5 4.5h3.2A2.2 2.2 0 0 1 10 6.7v8.8A2 2 0 0 0 8 15H4.5V4.5Z" />
      <path d="M15.5 4.5h-3.2A2.2 2.2 0 0 0 10 6.7v8.8A2 2 0 0 1 12 15h3.5V4.5Z" />
    </Icon>
  ),
  articles: (
    <Icon>
      <path d="M5 3.8h7.2L15.5 7v9.2H5V3.8Z" />
      <path d="M12.2 3.8V7h3.3M7.2 10h5.6M7.2 12.8h4.2" />
    </Icon>
  ),
  faqs: (
    <Icon>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M7.8 7.8a2.3 2.3 0 0 1 4.4.9c0 1.4-2.2 1.8-2.2 3.1M10 14.6h.01" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path d="M4.5 3.5h3l1.2 3.2-1.6 1.1a9 9 0 0 0 4.1 4.1l1.1-1.6 3.2 1.2v3a1.2 1.2 0 0 1-1.3 1.2A12.5 12.5 0 0 1 3.3 4.8a1.2 1.2 0 0 1 1.2-1.3Z" />
    </Icon>
  ),
  email: (
    <Icon>
      <rect x="3" y="5" width="14" height="10" rx="1.5" />
      <path d="m4 6.5 6 4.5 6-4.5" />
    </Icon>
  ),
  whatsapp: (
    <Icon>
      <path d="M10 3.5a6.5 6.5 0 0 0-5.6 9.8L3.5 16.5l3.3-.9A6.5 6.5 0 1 0 10 3.5Z" />
      <path d="M7.4 8.2c.1-.3.3-.3.4-.3h.4c.1 0 .3 0 .4.3l.6 1.5c.1.2 0 .3-.1.4l-.3.3c-.1.1-.1.3 0 .4.3.5.9 1.2 1.6 1.6.3.2.5.2.6.1l.4-.4c.1-.1.3-.1.4 0l1.3.7c.2.1.3.2.3.4 0 .2-.1.7-.4 1-.2.3-.8.6-1.3.6-.5 0-1.1-.1-2.7-.8-1.9-.8-3.2-2.9-3.3-3.1-.1-.2-.8-1-.8-1.9 0-.8.4-1.2.6-1.4Z" fill="currentColor" stroke="none" />
    </Icon>
  ),
  place: (
    <Icon>
      <path d="M10 17s5-4.2 5-8a5 5 0 1 0-10 0c0 3.8 5 8 5 8Z" />
      <circle cx="10" cy="9" r="1.6" />
    </Icon>
  ),
}

const WORK_LINKS = [
  { labelKey: 'nav.coaching', to: '/coaching', icon: 'coaching' },
  { labelKey: 'nav.consulting', to: '/consulting', icon: 'consulting' },
  { labelKey: 'nav.mandate', to: '/realty', icon: 'mandate' },
  { labelKey: 'nav.projects', to: '/project-hyderabad', icon: 'projects' },
  { labelKey: 'footer.listProperty', to: '/list-property', icon: 'market' },
]

const EXPLORE_LINKS = [
  { labelKey: 'nav.portfolio', to: '/about', icon: 'about' },
  { labelKey: 'nav.careers', to: '/careers', icon: 'careers' },
  { labelKey: 'nav.partners', to: '/partner', icon: 'partners' },
  { labelKey: 'footer.vendor', to: '/vendorpartner', icon: 'vendor' },
  { labelKey: 'nav.contentLibrary', to: '/content-library', icon: 'library' },
  { labelKey: 'nav.articles', to: '/articles', icon: 'articles' },
  { labelKey: 'nav.faqs', to: '/faqs', icon: 'faqs' },
]

const LEGAL_LINKS = [
  { labelKey: 'footer.privacy', to: '/privacy-policy' },
  { labelKey: 'footer.terms', to: '/terms' },
  { labelKey: 'footer.partnerTerms', to: '/partner/terms' },
]

function FooterSocialIcons() {
  const { pathname } = useLocation()
  const override = PAGE_SOCIAL_LINKS[pathname]
  const items = (override || SOCIAL_LINKS).map((link) => {
    if (link.href && link.href !== '#') return link
    return SOCIAL_LINKS.find((fallback) => fallback.label === link.label) || link
  })

  return (
    <div className="rw-footer-social" role="list">
      {items.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label.replace(' ↗', '')}
          className="rw-footer-social-btn"
          role="listitem"
        >
          {socialIcon(link.label)}
        </a>
      ))}
    </div>
  )
}

function FooterCol({ title, children, className = '' }) {
  return (
    <div className={`rw-footer-col${className ? ` ${className}` : ''}`}>
      <h2 className="rw-footer-col-title">{title}</h2>
      {children}
    </div>
  )
}

function FooterNavList({ items, t }) {
  return (
    <ul className="rw-footer-list rw-footer-nav">
      {items.map((item) => (
        <li key={item.to}>
          <Link to={item.to}>
            <span className="rw-footer-ico" aria-hidden>
              {ICONS[item.icon]}
            </span>
            {t(item.labelKey)}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/**
 * Site-wide footer. Multi-column layout (brand, work, explore, contact) with a
 * quiet legal bar. Optional `links` still accepted: a leading “← …” item becomes
 * a back crumb; other flat link lists are ignored in favour of the structure.
 */
export default function Footer({ links = [], chip = false }) {
  const { t } = useLang()
  const labelOf = (label) => (FOOTER_LABEL_KEYS[label] ? t(FOOTER_LABEL_KEYS[label]) : label)
  const back = links.find((link) => typeof link.label === 'string' && link.label.trim().startsWith('←') && link.to)

  return (
    <footer className={`rw-footer${chip ? ' is-chip' : ''}`}>
      <div className="rw-pad rw-footer-inner">
        {back && (
          <div className="rw-footer-back">
            <Link to={back.to}>{labelOf(back.label)}</Link>
          </div>
        )}

        <div className="rw-footer-grid">
          <div className="rw-footer-brand">
            <Link to="/" className="rw-footer-brand-mark" aria-label="Rajiv Williams home">
              <Wordmark size={52} />
            </Link>
            <p className="rw-footer-lede">{t('footer.lede')}</p>
            <BookButton interest="Footer" className="rw-footer-cta rw-cta">
              <span className="rw-footer-cta-ico" aria-hidden>
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.2 10.1 16.8 4.4 12.1 16.6l-2-4.6-4.6-1.9Z" />
                  <path d="M10.1 12 16.8 4.4" />
                </svg>
              </span>
              {t('footer.cta')}
            </BookButton>
            <FooterSocialIcons />
          </div>

          <FooterCol title={t('footer.col.work')}>
            <FooterNavList items={WORK_LINKS} t={t} />
          </FooterCol>

          <FooterCol title={t('footer.col.explore')}>
            <FooterNavList items={EXPLORE_LINKS} t={t} />
          </FooterCol>

          <FooterCol title={t('footer.col.contact')} className="rw-footer-col-contact">
            <ul className="rw-footer-list rw-footer-contact">
              <li>
                <a href={PHONE.href}>
                  <span className="rw-footer-ico" aria-hidden>{ICONS.phone}</span>
                  {PHONE.label}
                </a>
              </li>
              <li>
                <a href={EMAIL}>
                  <span className="rw-footer-ico" aria-hidden>{ICONS.email}</span>
                  connect@rajivwilliams.com
                </a>
              </li>
              <li>
                <a href={WHATSAPP} target="_blank" rel="noreferrer">
                  <span className="rw-footer-ico" aria-hidden>{ICONS.whatsapp}</span>
                  {t('footer.whatsapp')}
                </a>
              </li>
              <li className="rw-footer-place">
                <span className="rw-footer-ico" aria-hidden>{ICONS.place}</span>
                <span>{t('footer.place')}</span>
              </li>
            </ul>
          </FooterCol>
        </div>

        <div className="rw-footer-bar">
          <p className="rw-footer-copy">{t('footer.copy')}</p>
          <nav className="rw-footer-legal" aria-label={t('ui.legal')}>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.to} to={link.to}>{t(link.labelKey)}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
