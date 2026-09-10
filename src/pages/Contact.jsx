import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import hydMark from '../assets/site/hyd-05.svg'
import { EMAIL, FOOTER_LINKS, PHONE, WHATSAPP, mono, serif } from '../theme'
import { container, eyebrowFaded, sectionRule } from '../styles'

const HEADLINE = [
  { text: 'One form. ' },
  { br: true },
  { text: 'Read personally.', italic: true, copper: true },
]

const CONTACT_ROWS = [
  { label: 'EMAIL', value: 'connect@rajivwilliams.com', href: EMAIL },
  { label: 'PHONE', value: PHONE.label, href: PHONE.href },
  { label: 'WHATSAPP', value: 'Message on WhatsApp', href: WHATSAPP },
  { label: 'LOCATION', value: 'Shaikpet, Hyderabad, Telangana' },
]

export default function Contact() {
  return (
    <>
      <Seo route="/contact" />
      <Header />

      <PageIntro
        eyebrow="CONTACT · RAJIV WILLIAMS"
        headline={HEADLINE}
        lede="Coaching applications, developer enquiries, and RW Realty mandates all start here."
        intro="Book a call directly, or reach out on any of the channels below."
        cta={<BookButton interest="General enquiry" specular>BOOK A CALL</BookButton>}
      />

      <section style={{ ...sectionRule, background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 26 }}>REACH RAJIV DIRECTLY</Reveal>

          <div style={{ maxWidth: 560 }}>
            {CONTACT_ROWS.map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 20, borderTop: '1px solid var(--line)', padding: '18px 0' }}>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)', width: 110, flexShrink: 0 }}>
                  {row.label}
                </span>
                {row.href ? (
                  <a href={row.href} style={{ fontFamily: serif, fontSize: 19, color: 'var(--ink)' }}>{row.value}</a>
                ) : (
                  <span style={{ fontFamily: serif, fontSize: 19, color: 'var(--ink)' }}>{row.value}</span>
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
