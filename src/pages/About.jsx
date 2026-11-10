import ExperienceSection from '../components/ExperienceSection'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import ClosingCTA from '../components/ClosingCTA'
import hydMark from '../assets/site/hyd-01.svg'
import { ASSOCIATIONS, CREDENTIALS } from '../data/content'
import { useLang } from '../i18n/LangProvider'
import { associationRoleKey } from '../i18n/pages'
import { FOOTER_LINKS, mono } from '../theme'
import { fs, container, eyebrowFaded, sectionRule } from '../styles'

export default function About() {
  const { t } = useLang()
  const headline = [
    { text: t('about.h1') },
    { br: true },
    { text: t('about.h2'), italic: true, copper: true },
  ]

  return (
    <>
      <Seo route="/about" />
      <Header />

      <PageIntro
        eyebrow={t('about.eyebrow')}
        headline={headline}
        lede={t('about.lede')}
        intro={t('about.intro')}
        cta={<BookButton to="/form" interest="About" specular>{t('about.apply')}</BookButton>}
      />

      <ExperienceSection />

      {/* Credentials & associations */}
      <section id="credentials" style={{ ...sectionRule, background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 26 }}>{t('about.creds')}</Reveal>

          <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              {CREDENTIALS.map((c, i) => (
                <div key={c} style={{ borderTop: '1px solid var(--line)', padding: '16px 0', fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.02em', color: 'var(--ink)' }}>
                  {t(`about.cred.${i}`)}
                </div>
              ))}
            </div>
            <div>
              {ASSOCIATIONS.map((a) => (
                <div key={a.name} style={{ borderTop: '1px solid var(--line)', padding: '16px 0' }}>
                  <div style={{ fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.02em', color: 'var(--ink)' }}>
                    {a.name} <span style={{ color: 'var(--faded)' }}>· {t(associationRoleKey(a.role) || a.role)}</span>
                  </div>
                  {a.desc && <div style={{ marginTop: 4, fontFamily: mono, fontSize: fs('11px'), color: 'var(--faded)' }}>{t('about.assoc.hh')}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA title={t('about.close')} titleStyle={{ maxWidth: '15em' }}>
        <BookButton to="/form" interest="About" specular>{t('about.apply')}</BookButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
