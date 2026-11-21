import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import CtaButton from '../components/CtaButton'
import skylineImage from '../assets/site/skyline.png'
import { useLang } from '../i18n/LangProvider'
import { EMAIL, FOOTER_LINKS, PHONE, WHATSAPP, mono, serif } from '../theme'
import { container, eyebrowFaded, sectionRule } from '../styles'
import { CAREERS_INTEREST, INTERESTS, isValidPhone, submitBooking } from '../data/booking'

const emptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
  website: '',
  privacyConsent: false,
})

const CONTACT_INTERESTS = INTERESTS.filter((item) => item !== CAREERS_INTEREST)

function ContactForm() {
  const { t } = useLang()
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((current) => ({ ...current, [key]: value }))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!isValidPhone(form.phone)) {
      setError(t('contact.form.phoneErr'))
      setStatus('error')
      return
    }
    if (!form.privacyConsent) {
      setError(t('contact.form.consentErr'))
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      await submitBooking({
        ...form,
        source: 'contact',
      })
      setStatus('sent')
      setForm(emptyForm())
    } catch {
      setError(t('contact.form.error'))
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rw-contact-form is-done">
        <p className="rw-contact-form-eyebrow">{t('contact.form.thanksTitle')}</p>
        <p className="rw-contact-form-thanks">{t('contact.form.thanks')}</p>
      </div>
    )
  }

  return (
    <form className="rw-contact-form" onSubmit={onSubmit} noValidate>
      <div className="rw-contact-form-head">
        <p className="rw-contact-form-eyebrow">{t('contact.form.eyebrow')}</p>
        <p className="rw-contact-form-note">{t('contact.form.note')}</p>
      </div>

      <label className="rw-contact-field">
        <span>{t('field.name')} *</span>
        <input required value={form.name} onChange={set('name')} placeholder={t('ph.fullName')} autoComplete="name" />
      </label>
      <label className="rw-contact-field">
        <span>{t('field.email')} *</span>
        <input required type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" />
      </label>
      <label className="rw-contact-field">
        <span>{t('field.phone')} *</span>
        <input
          required
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={form.phone}
          onChange={set('phone')}
          placeholder={t('ph.phone')}
        />
      </label>
      <label className="rw-contact-field">
        <span>{t('field.interest')}</span>
        <select value={form.interest} onChange={set('interest')}>
          <option value="">{t('ph.selectOne')}</option>
          {CONTACT_INTERESTS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="rw-contact-field rw-contact-field--wide">
        <span>{t('field.message')}</span>
        <textarea value={form.message} onChange={set('message')} rows={4} placeholder={t('ph.message')} />
      </label>

      <label className="rw-contact-hp" aria-hidden="true">
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </label>

      <label className="rw-contact-consent" htmlFor="contact-privacy">
        <input
          id="contact-privacy"
          type="checkbox"
          checked={form.privacyConsent}
          onChange={set('privacyConsent')}
        />
        <span>
          {t('contact.form.consent')}{' '}
          <Link to="/privacy-policy" target="_blank" rel="noreferrer">{t('footer.privacy')}</Link>
        </span>
      </label>

      {status === 'error' && error && (
        <p className="rw-contact-form-error">{error}</p>
      )}

      <CtaButton type="submit" disabled={status === 'sending'} style={{ width: '100%' }}>
        {status === 'sending' ? t('cta.sending') : t('contact.form.send')}
      </CtaButton>
    </form>
  )
}

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
      />

      <section className="rw-contact-band" style={{ ...sectionRule, position: 'relative', overflow: 'hidden' }}>
        <img
          src={skylineImage}
          alt=""
          aria-hidden
          loading="lazy"
          className="rw-contact-skyline"
        />
        <div className="rw-contact-skyline-wash" aria-hidden />
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px', position: 'relative', zIndex: 1 }}>
          <div className="rw-contact-layout">
            <Reveal>
              <ContactForm />
            </Reveal>

            <aside className="rw-contact-reach" aria-labelledby="rw-contact-reach-title">
              <Reveal>
                <p id="rw-contact-reach-title" style={{ ...eyebrowFaded, marginBottom: 18 }}>
                  {t('contact.reach')}
                </p>
                <p className="rw-contact-reach-note">{t('contact.reachNote')}</p>
                <ul className="rw-contact-list">
                  {rows.map((row) => (
                    <li key={row.key} className="rw-contact-row">
                      <span className="rw-contact-label" style={{ fontFamily: mono }}>
                        {row.label}
                      </span>
                      {row.href ? (
                        <a href={row.href} className="rw-contact-value" style={{ fontFamily: serif }}>
                          {row.value}
                        </a>
                      ) : (
                        <span className="rw-contact-value" style={{ fontFamily: serif }}>
                          {row.value}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
