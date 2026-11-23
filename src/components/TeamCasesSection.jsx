import Reveal from './Reveal'
import SectionHead from './SectionHead'
import { useLang } from '../i18n/LangProvider'
import { mono, serif, text } from '../theme'
import { body, container, sectionRule } from '../styles'

/** How Team RW helped previous clients: anonymised consulting case + mandate model. */
export default function TeamCasesSection() {
  const { t } = useLang()

  const cases = [
    {
      key: 'consult',
      eyebrow: t('portfolio.cases.0.eyebrow'),
      title: (
        <>
          {t('portfolio.cases.0.title.a')}
          <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>{t('portfolio.cases.0.title.b')}</span>
        </>
      ),
      body: t('portfolio.cases.0.body'),
      stats: [
        { v: t('portfolio.cases.0.stat.0.v'), l: t('portfolio.cases.0.stat.0.l') },
        { v: t('portfolio.cases.0.stat.1.v'), l: t('portfolio.cases.0.stat.1.l') },
        { v: t('portfolio.cases.0.stat.2.v'), l: t('portfolio.cases.0.stat.2.l') },
      ],
    },
    {
      key: 'mandate',
      eyebrow: t('portfolio.cases.1.eyebrow'),
      title: t('portfolio.cases.1.title'),
      body: t('portfolio.cases.1.body'),
      points: [
        t('portfolio.cases.1.a'),
        t('portfolio.cases.1.b'),
        t('portfolio.cases.1.c'),
      ],
      close: t('portfolio.cases.1.close'),
    },
  ]

  return (
    <section id="cases" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
        <SectionHead
          eyebrow={t('portfolio.cases.eyebrow')}
          title={t('portfolio.cases.title.a')}
          titleAccent={t('portfolio.cases.title.b')}
          titleWidth="18em"
        />

        <div className="rw-team-cases">
          {cases.map((item, i) => (
            <Reveal key={item.key} delay={i * 100} className="rw-team-case">
              <div className="rw-team-case-kicker" style={{ fontFamily: mono }}>
                {item.eyebrow}
              </div>
              <h3 className="rw-team-case-title" style={{ fontFamily: serif }}>
                {item.title}
              </h3>
              <p className="rw-team-case-body" style={{ fontFamily: text }}>
                {item.body}
              </p>
              {item.points && (
                <ul className="rw-team-case-points">
                  {item.points.map((point) => (
                    <li key={point} style={{ fontFamily: text }}>{point}</li>
                  ))}
                </ul>
              )}
              {item.stats && (
                <div className="rw-team-case-stats">
                  {item.stats.map((stat) => (
                    <div key={stat.l}>
                      <div className="rw-team-case-stat-v" style={{ fontFamily: serif }}>{stat.v}</div>
                      <div className="rw-team-case-stat-l" style={{ fontFamily: mono }}>{stat.l}</div>
                    </div>
                  ))}
                </div>
              )}
              {item.close && (
                <p className="rw-team-case-close" style={{ ...body, marginTop: 18, maxWidth: '36em' }}>
                  {item.close}
                </p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
