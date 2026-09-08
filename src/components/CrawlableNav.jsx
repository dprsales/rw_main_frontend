/** Always-in-DOM nav links so crawlers see pages before the wheel menu opens (clip-rect hidden, not display:none). */
import { Link } from 'react-router-dom'

/** Mirrors SITE_NAV in Header.jsx, minus the booking action (not a URL). */
const CRAWLABLE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Luxury sales coaching', to: '/coaching' },
  { label: 'Developer sales consulting', to: '/consulting' },
  { label: 'RW Realty mandates', to: '/realty' },
  { label: 'Track record and portfolio', to: '/realty/portfolio' },
  { label: 'About Rajiv Williams', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Careers', to: '/careers' },
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
