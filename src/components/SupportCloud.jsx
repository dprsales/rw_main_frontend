import { useState } from 'react'
import { SUPPORT_SERVICES } from '../data/content'
import { useLang } from '../i18n/LangProvider'
import { mono, serif } from '../theme'

/** "& More" services as a chip cloud. The first chip is on by default so the
 *  caption is never empty; hover (or tap/focus) moves the active one. */
export default function SupportCloud() {
  const { t } = useLang()
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="rw-chips">
        {SUPPORT_SERVICES.map((svc, i) => (
          <button
            key={svc.title}
            type="button"
            className={`rw-chip${i === active ? ' is-on' : ''}`}
            style={{ fontFamily: mono }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            {t(`home.more.${i}.title`)}
          </button>
        ))}
      </div>

      <div className="rw-chip-caption">
        <span className="rw-chip-caption-num" style={{ fontFamily: mono }}>
          {String(active + 1).padStart(2, '0')} / {String(SUPPORT_SERVICES.length).padStart(2, '0')}
        </span>
        <div className="rw-chip-caption-stack">
          {SUPPORT_SERVICES.map((svc, i) => (
            <p
              key={svc.title}
              className={`rw-chip-caption-text${i === active ? ' is-on' : ''}`}
              style={{ fontFamily: serif }}
              aria-hidden={i !== active}
            >
              <span className="rw-chip-caption-label" style={{ fontFamily: mono }}>{t(`home.more.${i}.title`)}</span>
              {t(`home.more.${i}.desc`)}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
