import Reveal from './Reveal'
import { useLang } from '../i18n/LangProvider'
import { mono, text } from '../theme'
import { fs, container, sectionHeading, sectionRule } from '../styles'

const WHY_POINTS = 10

/** Practice-wide reasons to work with Team RW. Lives on the About page. */
export default function WhyTeamRwSection() {
  const { t } = useLang()

  return (
    <section id="why-team-rw" style={{ ...sectionRule, background: 'var(--card)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <Reveal as="h2" style={{ ...sectionHeading, fontSize: fs('clamp(28px,3.4vw,44px)'), lineHeight: 1.05, maxWidth: '12em' }}>
          {t('about.whyTitle')}
        </Reveal>
        <Reveal as="p" delay={80} style={{ marginTop: 18, fontFamily: text, fontWeight: 300, fontSize: fs('17px'), lineHeight: 1.6, color: 'var(--faded)', maxWidth: '36em' }}>
          {t('about.whyLede')}
        </Reveal>

        <div
          className="rw-grid-2"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px', marginTop: 'clamp(36px,5vw,52px)' }}
        >
          {Array.from({ length: WHY_POINTS }, (_, i) => (
            <Reveal
              key={i}
              delay={Math.min(i * 40, 280)}
              style={{
                display: 'grid',
                gridTemplateColumns: '18px 1fr',
                gap: 14,
                alignItems: 'start',
                borderTop: '1px solid var(--line)',
                padding: '16px 0',
              }}
            >
              <span aria-hidden style={{ color: 'var(--copper)', fontFamily: mono, fontSize: fs('13px'), lineHeight: 1.45, marginTop: 1 }}>
                ✓
              </span>
              <span style={{ fontFamily: text, fontWeight: 400, fontSize: fs('15px'), lineHeight: 1.45, letterSpacing: '.01em', color: 'var(--ink)' }}>
                {t(`about.why.${i}`)}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
