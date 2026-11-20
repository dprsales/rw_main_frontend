/**
 * Always-in-the-DOM nav mirroring SITE_NAV: Header's <Link>s only exist inside the
 * wheel menu portal, so crawlers see no links until it's opened. This is additive,
 * visually hidden via the clip-rect pattern (not display/visibility, which Google discounts).
 */
import { Link } from 'react-router-dom'

/** Mirrors primary IA + secondary routes in Header.jsx SITE_NAV (minus booking). */
const CRAWLABLE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Coaching', to: '/coaching' },
  { label: 'One-to-One Mentoring', to: '/one-to-one' },
  { label: 'Luxury Sales Mastery', to: '/luxarysales' },
  { label: 'High Ticket Sales Mastery', to: '/highticketsales' },
  { label: 'Business Consulting', to: '/consulting' },
  { label: 'Branding and Marketing', to: '/brandconsulting' },
  { label: 'Sales Mandate', to: '/realty' },
  { label: 'Investment Advisory', to: '/investmentadvisory' },
  { label: 'Buy, sell, rent', to: '/listings' },
  { label: 'Careers', to: '/careers' },
  { label: 'Hiring', to: '/hiring' },
  { label: 'Contact', to: '/contact' },
  { label: 'About Rajiv Williams and Team RW', to: '/about' },
  { label: 'Why Team RW', to: '/about#why-team-rw' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Channel Partner Terms', to: '/partner/terms' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Articles', to: '/articles' },
  { label: 'Content Library', to: '/content-library' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Channel partner applications', to: '/partner' },
  { label: 'AI assessment', to: '/assessment' },
]

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export default function CrawlableNav() {
  return (
    <nav aria-label="Site" style={visuallyHidden}>
      <ul>
        {CRAWLABLE_LINKS.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { CRAWLABLE_LINKS }
