import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import hydMark from '../assets/site/hyd-05.svg'
import { useLang } from '../i18n/LangProvider'
import { EMAIL, FOOTER_LINKS, PHONE, WHATSAPP, mono, serif } from '../theme'
import { fs, container, eyebrowFaded, sectionRule } from '../styles'

export default function Contact() {
  const { t } = useLang()
  const headline = [
    { text: t('contact.h1') },
    { br: true },
    { text: t('contact.h2'), italic: true, copper: true },
  ]
  const rows = [
    { key: 'email', label: t('contact.email'), value: 'connect@rajivwilliams.com', href: EMAIL },
    { key: 'phone', label: t('contact.phone'), value: PHONE.label, href: PHONE.href },
    { key: 'whatsapp', label: t('contact.whatsapp'), value: t('contact.wa'), href: WHATSAPP },
    { key: 'location', label: t('contact.location'), value: t('contact.place') },
  ]

  return (
    <>
      <Seo route="/contact" />
      <Header />

      <PageIntro
        eyebrow={t('contact.eyebrow')}
        headline={headline}
        lede={t('contact.lede')}
        intro={t('contact.intro')}
        cta={<BookButton to="/form" interest="General enquiry" specular>{t('cta.bookCall')}</BookButton>}
      />

      <section style={{ ...sectionRule, background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 26 }}>{t('contact.reach')}</Reveal>

          <div style={{ maxWidth: 560 }}>
            {rows.map((row) => (
              <div key={row.key} className="rw-contact-row" style={{ display: 'flex', alignItems: 'baseline', gap: 20, borderTop: '1px solid var(--line)', padding: '18px 0' }}>
                <span className="rw-contact-label" style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'var(--faded)', width: 110, flexShrink: 0 }}>
                  {row.label}
                </span>
                {row.href ? (
                  <a href={row.href} style={{ fontFamily: serif, fontSize: fs('19px'), color: 'var(--ink)' }}>{row.value}</a>
                ) : (
                  <span style={{ fontFamily: serif, fontSize: fs('19px'), color: 'var(--ink)' }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
