import Reveal from './Reveal'
import { mono, serif } from '../theme'
import { eyebrow, note } from '../styles'

/* Score → tone lines, honest to the band the route maps to. Never a made-up number. */
function bandLineFor(overall) {
  if (overall == null) return null
  if (overall >= 60) return 'Advanced refinement — you are building on a strong base.'
  if (overall >= 50) return 'Gap-based progression — targeted work will move you quickly.'
  if (overall >= 40) return 'Priority improvement areas — a focused plan lifts you fastest.'
  return 'Foundations first — the basics give you the fastest gains.'
}

const BAR_STYLE = {
  height: 2,
  background: 'var(--chip)',
  marginTop: 5,
  overflow: 'hidden',
}

const bandChip = {
  fontFamily: mono,
  fontSize: 9,
  letterSpacing: '.14em',
  color: 'var(--faded)',
  border: '1px solid var(--line)',
  borderRadius: 999,
  padding: '4px 10px',
  whiteSpace: 'nowrap',
}

/**
 * Score at a glance — the customer-facing readout of an assessment result.
 *
 * Rendered from `scoreData` when real values are present (?score / ?categories),
 * otherwise from the route scenario's band so nothing is ever invented.
 */
export default function ScoreResult({ scenario, scoreData, delay = 0 }) {
  const overall = scoreData?.overall
  const dims = scoreData?.dimensions ?? []

  const sortedDims = [...dims].sort((a, b) => a.value - b.value)
  const priorityDims = sortedDims.slice(0, 3)
  const strongest = sortedDims.length ? sortedDims[sortedDims.length - 1] : null

  const hasData = overall != null || dims.length > 0
  const isNumber = hasData && overall != null
  const headline = isNumber ? `${Math.round(overall)}` : scenario.bandTitle
  const statusLine = bandLineFor(overall) ?? scenario.bandTitle

  return (
    <Reveal delay={delay}>
      <div style={{ border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', position: 'relative' }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />

        <div style={{ padding: 'clamp(26px,3.4vw,36px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', color: 'var(--copper)' }}>
                YOUR ASSESSMENT SCORE
              </div>
              <div style={{ fontFamily: serif, fontSize: 17, color: 'var(--ink)', marginTop: 4 }}>
                Interview Readiness Score
              </div>
            </div>
            <span style={bandChip}>
              {hasData ? 'LIVE RESULT' : 'RESULT BAND'}
            </span>
          </div>

          {/* Overall score / band */}
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
              <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--faded)' }}>
                OUT OF 100
              </span>
            )}
          </div>
          <p style={{ ...note, fontSize: 16, color: 'var(--ink)', lineHeight: 1.5 }}>{statusLine}</p>

          {/* Per-dimension bars when real scores exist */}
          {dims.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
              {dims.map((d) => (
                <div key={d.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.08em', color: 'var(--faded)' }}>
                      {d.label.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: 12, color: 'var(--copper)' }}>
                      {d.value}%{d.value < 50 ? ' · HIGH PRIORITY' : ''}
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
              <span style={{ ...note, fontSize: 14, color: 'var(--ink)', lineHeight: 1.5 }}>
                Your priority areas and the full development plan follow below.
              </span>
            </div>
          )}

          {/* Strongest vs priority footer */}
          <div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--copper)', flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.06em', color: 'var(--faded)' }}>
                {strongest
                  ? `STRONGEST: ${strongest.short.toUpperCase()} (${strongest.value}%)`
                  : 'STRONGEST AREAS ARRIVE WITH YOUR FULL REPORT'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--copper)', flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.06em', color: 'var(--faded)' }}>
                {priorityDims.length
                  ? `PRIORITY: ${priorityDims.map((d) => d.short.toUpperCase()).join(' · ')}`
                  : 'PRIORITY: FOCUSED DEVELOPMENT'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}