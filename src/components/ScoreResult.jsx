import Reveal from './Reveal'
import { useLang } from '../i18n/LangProvider'
import { mono, serif } from '../theme'
import { fs, note } from '../styles'

function bandLineFor(t, overall) {
  if (overall == null) return null
  if (overall >= 60) return t('score.band.60')
  if (overall >= 50) return t('score.band.50')
  if (overall >= 40) return t('score.band.40')
  return t('score.band.low')
}

const BAR_STYLE = {
  height: 2,
  background: 'var(--chip)',
  marginTop: 5,
  overflow: 'hidden',
}

/**
 * Score at a glance — the customer-facing readout of an assessment result.
 *
 * Rendered from `scoreData` when real values are present (?score / ?categories),
 * otherwise from the route scenario's band so nothing is ever invented.
 */
export default function ScoreResult({ scenario, scoreData, delay = 0 }) {
  const { t } = useLang()
  const overall = scoreData?.overall
  const dims = scoreData?.dimensions ?? []

  const sortedDims = [...dims].sort((a, b) => a.value - b.value)
  const priorityDims = sortedDims.slice(0, 3)
  const strongest = sortedDims.length ? sortedDims[sortedDims.length - 1] : null

  const hasData = overall != null || dims.length > 0
  const isNumber = hasData && overall != null
  const headline = isNumber ? `${Math.round(overall)}` : scenario.bandTitle
  const statusLine = bandLineFor(t, overall)

  return (
    <Reveal delay={delay}>
      <div style={{ border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', position: 'relative' }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />

        <div style={{ padding: 'clamp(26px,3.4vw,36px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.16em', color: 'var(--copper)' }}>
                {t('score.your')}
              </div>
              <div style={{ fontFamily: serif, fontSize: fs('17px'), color: 'var(--ink)', marginTop: 4 }}>
                {t('score.readiness')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, margin: '22px 0 6px' }}>
            <span style={{
              fontFamily: serif,
              fontSize: isNumber ? 'clamp(46px,6vw,64px)' : 'clamp(24px,3vw,32px)',
              color: 'var(--copper)',
              lineHeight: 1.1,
            }}>
              {headline}
            </span>
            {isNumber && (
              <span style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--faded)' }}>
                {t('score.outOf')}
              </span>
            )}
          </div>
          {statusLine && (
            <p style={{ ...note, fontSize: fs('16px'), color: 'var(--ink)', lineHeight: 1.5 }}>{statusLine}</p>
          )}

          {dims.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
              {dims.map((d) => (
                <div key={d.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.08em', color: 'var(--faded)' }}>
                      {d.label.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: fs('12px'), color: 'var(--copper)' }}>
                      {d.value}%{d.value < 50 ? t('score.highPriority') : ''}
                    </span>
                  </div>
                  <div style={BAR_STYLE}>
                    <div style={{ height: '100%', width: `${d.value}%`, background: 'var(--gold-gradient)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 22, border: '1px dashed var(--line)', padding: '13px 16px' }}>
              <span style={{ ...note, fontSize: fs('14px'), color: 'var(--ink)', lineHeight: 1.5 }}>
                {t('score.fallback')}
              </span>
            </div>
          )}

          <div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--copper)', flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: fs('9px'), letterSpacing: '.06em', color: 'var(--faded)' }}>
                {strongest
                  ? t('score.strongest', { name: strongest.short.toUpperCase(), value: strongest.value })
                  : t('score.strongestEmpty')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--copper)', flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: fs('9px'), letterSpacing: '.06em', color: 'var(--faded)' }}>
                {priorityDims.length
                  ? t('score.priority', { names: priorityDims.map((d) => d.short.toUpperCase()).join(' · ') })
                  : t('score.priorityEmpty')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
