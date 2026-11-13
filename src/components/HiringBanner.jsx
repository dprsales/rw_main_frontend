import { Link, useLocation } from 'react-router-dom'
import { activeHiringCampaigns, showHiringRail } from '../data/content'
import { careerRolePath } from '../data/jobs'
import { useLang } from '../i18n/LangProvider'
import { hireLineKey } from '../i18n/pages'
import { openHiringModal } from './HiringModal'

/** Time-bound hiring rail. Both open roles scroll as one strip; each Apply
 *  jumps straight into that role’s careers form. Poster opens from the title. */
export default function HiringBanner() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const campaigns = activeHiringCampaigns()
  const onRail = showHiringRail(pathname)

  if (!onRail || !campaigns.length) return null

  const loop = campaigns.length > 1 ? [...campaigns, ...campaigns] : campaigns

  return (
    <div className="rw-hire-bar" role="region" aria-label={t('hire.urgent')}>
      <div className="rw-hire-bar-inner">
        <span className="rw-hire-tag">{t('hire.urgent')}</span>
        <div className="rw-hire-marquee" aria-live="off">
          <div className={`rw-hire-track${campaigns.length > 1 ? ' is-moving' : ''}`}>
            {loop.map((row, i) => (
              <div key={`${row.title}-${i}`} className="rw-hire-item">
                <button
                  type="button"
                  className="rw-hire-copy"
                  onClick={() => openHiringModal(row.title)}
                >
                  <strong>{row.title}</strong>
                  {row.location ? <span className="rw-hire-meta"> · {row.location}</span> : null}
                  {row.line ? (
                    <span className="rw-hire-line">
                      {' · '}{hireLineKey(row.title) ? t(hireLineKey(row.title)) : row.line}
                    </span>
                  ) : null}
                </button>
                <Link className="rw-hire-go" to={careerRolePath(row.title)}>
                  {t('hire.apply')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
