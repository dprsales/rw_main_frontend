import Reveal from './Reveal'
import { useLang } from '../i18n/LangProvider'
import { fs, body, container, eyebrow, sectionHeadingLg } from '../styles'

/** Text-only About: the portrait moved up to the Portfolio hero, so the heading sits
 *  left and the story right; .rw-split stacks them on smaller screens. */
export default function AboutSection() {
  const { t } = useLang()
  return (
    <section id="about" className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,120px) 40px' }}>
      <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 'clamp(32px,6vw,90px)', alignItems: 'start' }}>
        <div>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em', marginBottom: 22 }}>{t('portfolio.about.eyebrow')}</Reveal>
          <Reveal as="h2" style={{ ...sectionHeadingLg, fontSize: fs('clamp(34px,4.6vw,62px)'), lineHeight: 1.02 }}>
            {t('portfolio.about.title.1')}<br />{t('portfolio.about.title.2')}
          </Reveal>
        </div>
        <div style={{ paddingTop: 'clamp(0px,3vw,44px)' }}>
          <Reveal as="p" delay={120} style={{ ...body, margin: 0, maxWidth: '37em' }}>
            {t('portfolio.about.p1.a')}<span style={{ color: 'var(--copper)', fontWeight: 500 }}>16+</span>{t('portfolio.about.p1.b')}<span style={{ color: 'var(--copper)', fontWeight: 500 }}>₹2,700 Cr</span>{t('portfolio.about.p1.c')}<span style={{ color: 'var(--copper)', fontWeight: 500 }}>1,200</span>{t('portfolio.about.p1.d')}
          </Reveal>
          <Reveal as="p" delay={200} style={{ ...body, marginTop: 20, maxWidth: '37em' }}>
            {t('portfolio.about.p2')}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
