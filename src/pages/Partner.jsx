import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import PageIntro from '../components/PageIntro'
import ClosingCTA from '../components/ClosingCTA'
import { BookButton } from '../components/BookingModal'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { submitChannelPartner, getErrorMessage } from '../data/api'
import { track } from '../data/analytics'
import { FOOTER_LINKS, mono, serif, text, WHATSAPP } from '../theme'
import { container, ctaCopper, eyebrow, note, sectionHeading, sectionRule } from '../styles'
import '../form/form.css'

const PARTNER_INTEREST = 'Channel partner application'

const HEADLINE = [
  { text: 'Sell luxury inventory ' },
  { br: true },
  { text: 'with the people who move it.', italic: true, copper: true },
]

const VALUE = [
  {
    n: '01',
    tag: 'ACCESS',
    title: 'Exclusive mandates, not open-market scraps.',
    body: 'A small roster of projects owned end to end. Mandate inventory is not pitched by every broker in the city, so your buyers are chasing a property only you can sell.',
  },
  {
    n: '02',
    tag: 'TRUST',
    title: 'Golden-rate commissions, published before you sign.',
    body: 'The structure is on the table from day one, the deal log is shared every month, and payments clear on schedule. No surprises at settlement.',
  },
  {
    n: '03',
    tag: 'GROWTH',
    title: 'Training, warm leads and volume.',
    body: 'In-house sales training before the first site visit, leads kept warm by our funnel, and more inventory offered as your numbers come in.',
  },
]

const STEPS = [
  { n: '1', title: 'Apply', body: 'The form below takes about ten minutes. References matter more than a big deck.' },
  { n: '2', title: 'Qualify', body: 'A call with the team and a short reference check, usually within the week.' },
  { n: '3', title: 'Mandate in', body: 'Access to live inventory, sales training, and the deal room.' },
]

const PILL_FIELDS = [
  { title: 'Years in real estate', id: 'yearsExperience', required: true, options: ['0-2', '2-5', '5-10', '10+'] },
  { title: 'Team size', id: 'teamSize', options: ['Just me', '2-5', '6-15', '15+'] },
  { title: 'Current developer ties', id: 'currentDeveloperPartnerships', options: ['None', 'One developer', 'Two or three', 'More than three'], help: 'So we can flag conflicts before money gets messy.' },
]

const CHECK_GROUPS = [
  { title: 'Which categories do you sell?', id: 'projectCategories', options: ['Luxury apartments', 'Villas', 'Commercial', 'Plots and land', 'Township', 'Mixed use'] },
  { title: 'Who do you sell to?', id: 'buyerSegments', options: ['HNI / UHNI buyers', 'NRIs', 'Investors', 'End users'] },
]

const INPUT_FIELDS = [
  { title: 'Full name', id: 'name', required: true, placeholder: 'Your name' },
  { title: 'Phone', id: 'phone', required: true, type: 'tel', placeholder: '+91 ·····' },
  { title: 'Email', id: 'email', required: true, type: 'email', placeholder: 'you@agency.com' },
  { title: 'Agency / company', id: 'agencyName', required: true, placeholder: 'The firm you work under' },
  { title: 'Designation', id: 'designation', placeholder: 'Partner, director, BD head' },
  { title: 'Base city', id: 'city', required: true, placeholder: 'Hyderabad' },
  { title: 'Operating cities', id: 'operatingCities', placeholder: 'Where you actually sell' },
  { title: 'RERA / licence no', id: 'reraNo', optional: true, placeholder: 'Not required to apply' },
  { title: 'Expected monthly business', id: 'expectedMonthlyBusiness', placeholder: 'e.g. ₹5 Cr' },
  { title: 'Preferred inventory', id: 'preferredInventory', placeholder: 'What you want to carry next' },
  { title: 'Website or social links', id: 'socialLinks', optional: true, placeholder: 'Separate with commas' },
  { title: 'How did you hear about us?', id: 'referralSource', optional: true, placeholder: 'Referral, LinkedIn, an ad' },
]

function queryAttribution(search) {
  const q = new URLSearchParams(search)
  const pick = (key) => q.get(key) || ''
  return {
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
    utmTerm: pick('utm_term'),
    utmContent: pick('utm_content'),
    clickId: pick('fbclid') || pick('gclid'),
  }
}

export default function Partner() {
  const scrollToId = useSmoothScroll()
  const { search } = useLocation()

  const [attribution] = useState(() => queryAttribution(search))
  const [values, setValues] = useState({})
  const [checks, setChecks] = useState({ projectCategories: [], buyerSegments: [] })
  const [pills, setPills] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [referenceNo, setReferenceNo] = useState('')
  const honeypot = useRef('')

  const set = (id) => (e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))

  const toggleCheck = (id, option) => setChecks((prev) => ({
    ...prev,
    [id]: prev[id].includes(option) ? prev[id].filter((v) => v !== option) : [...prev[id], option],
  }))

  const setPill = (id, option) => setPills((prev) => ({ ...prev, [id]: prev[id] === option ? '' : option }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (honeypot.current.value) {
      setStatus('done')
      return
    }
    if (!pills.yearsExperience) {
      setError('Please choose your years of experience.')
      return
    }
    setError('')
    setStatus('sending')

    const payload = {
      ...values,
      ...pills,
      currentDeveloperPartnerships: pills.currentDeveloperPartnerships
        ? [pills.currentDeveloperPartnerships]
        : undefined,
      projectCategories: checks.projectCategories,
      buyerSegments: checks.buyerSegments,
      ...attribution,
      referrer: document.referrer || '',
      submittedAt: new Date().toISOString(),
    }

    try {
      const res = await submitChannelPartner(payload)
      setReferenceNo(res?.referenceNo || res?.reference || '')
      setStatus('done')
      track('partner_application_submitted', payload)
    } catch (err) {
      setError(getErrorMessage(err))
      setStatus('idle')
    }
  }

  /* Attribution still arrives reliably when the route lands from a fresh page load. */
  useEffect(() => {
    track('partner_page_view', { utmSource: attribution.utmSource })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Seo route="/partner" />
      <Header />

      {/* Intro */}
      <PageIntro
        eyebrow="RW REALTY · CHANNEL PARTNERS"
        headline={HEADLINE}
        lede="Exclusive mandates, golden-rate commissions, and a team that runs the funnel with you."
        intro="RW Realty carries a small number of projects at a time, on exclusive mandates. Partners inside those mandates get inventory worth carrying, leads we keep warm, and the training to close at the ticket size."
        cta={<>
          <button type="button" onClick={() => scrollToId('apply')} className="rw-cta rw-cta--live" style={ctaCopper}>
            APPLY TO BECOME A CHANNEL PARTNER <span className="rw-cta-arrow" aria-hidden> →</span>
          </button>
          <BookButton specular interest={PARTNER_INTEREST}>OR BOOK A CALL FIRST</BookButton>
        </>}
      />

      {/* Why partner with us */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrow, marginBottom: 14 }}>WHY PARTNER WITH US</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
            A few mandates, run properly.
          </Reveal>

          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(16px, 2.2vw, 30px)', marginTop: 'clamp(40px,5vw,64px)',
            }}
          >
            {VALUE.map((item, i) => (
              <Reveal key={item.n} delay={i * 90} style={{ border: '1px solid var(--line)', background: 'var(--card)', padding: 'clamp(26px,3.4vw,38px)' }}>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--copper)' }}>{item.tag}</div>
                <h3 style={{ marginTop: 16, fontFamily: serif, fontWeight: 400, fontSize: 'clamp(21px,2.3vw,25px)', lineHeight: 1.15, color: 'var(--ink)' }}>
                  {item.title}
                </h3>
                <p style={{ ...note, marginTop: 12, fontSize: 16, lineHeight: 1.55 }}>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Statement band */}
      <section style={{ ...sectionRule, background: 'var(--card)', position: 'relative', overflow: 'hidden' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(64px,8vw,96px) 40px', textAlign: 'center' }}>
          <Reveal as="p" style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,44px)', lineHeight: 1.12, maxWidth: '20em', margin: '0 auto' }}>
            Serious inventory. Serious commissions.{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>A partner who keeps score openly.</span>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <Reveal style={{ ...eyebrow, marginBottom: 16 }}>HOW IT WORKS</Reveal>
        <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
          Three steps, about two weeks.
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(28px,4vw,56px)', marginTop: 'clamp(44px,6vw,64px)' }}>
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 90}>
              <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.08em', color: 'var(--copper)', borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>STEP {step.n}</div>
              <div style={{ marginTop: 20, fontFamily: serif, fontSize: 'clamp(21px,2.4vw,27px)', color: 'var(--ink)' }}>{step.title}</div>
              <p style={{ ...note, marginTop: 8, fontSize: 16, lineHeight: 1.55 }}>{step.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Application */}
      <section id="apply" style={{ ...sectionRule, background: 'var(--chip)', borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>APPLICATION</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, marginTop: 16 }}>
            Apply to become a channel partner.
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 14, fontSize: 'clamp(16px,1.7vw,18px)', maxWidth: '36em' }}>
            Ten minutes, references over a big deck. Everything you share stays between us.
          </Reveal>

          {status === 'done' ? (
            <Reveal delay={100} style={{ textAlign: 'center', paddingTop: 'clamp(44px,6vw,66px)' }}>
              <div className="rw-form-ring">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M4 12.5 9.5 18 20 6.5" />
                </svg>
              </div>
              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(24px,3vw,32px)', color: 'var(--ink)', marginTop: 26 }}>
                Application received{referenceNo ? ` · ${referenceNo}` : ''}.
              </h3>
              <p style={{ ...note, marginTop: 14, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em' }}>
                We respond within two working days, usually sooner. {
                  referenceNo ? 'Reference it as ' + referenceNo : 'No need to follow up'
                } — and if you would rather talk first, call or WhatsApp us below.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 32 }}>
                <a className="rw-cta" style={{ ...ctaCopper }} href={WHATSAPP} target="_blank" rel="noreferrer">
                  WHATSAPP THE TEAM
                </a>
                <BookButton specular interest={PARTNER_INTEREST}>BOOK A CALL</BookButton>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={160}>
              <form onSubmit={handleSubmit} style={{ marginTop: 'clamp(34px,5vw,50px)' }}>
                {/* Honeypot - humans never see this field. */}
                <input
                  ref={honeypot}
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                />

                {/* One connected panel: fields are separated by hairlines, not boxes. */}
                <div className="rw-form-panel">
                  {INPUT_FIELDS.map((field) => (
                    <label key={field.id} className="rw-form-field-wrap" style={{ display: 'block' }}>
                      <span className="rw-form-q-title">
                        {field.title}
                        {field.required
                          ? <span className="rw-form-req"> *</span>
                          : <span className="rw-form-optional"> (optional)</span>}
                      </span>
                      <input
                        className="rw-form-field"
                        type={field.type || 'text'}
                        style={{ marginTop: 10 }}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={values[field.id] || ''}
                        onChange={set(field.id)}
                      />
                    </label>
                  ))}

                  {PILL_FIELDS.map((field) => (
                    <div key={field.id} className={`rw-form-field-wrap${field.id === 'currentDeveloperPartnerships' ? ' rw-form-field-wrap--wide' : ''}`}>
                      <span className="rw-form-q-title">
                        {field.title}
                        {field.required
                          ? <span className="rw-form-req"> *</span>
                          : <span className="rw-form-optional"> (optional)</span>}
                      </span>
                      {field.help && <span className="rw-form-help">{field.help}</span>}
                      <div className="rw-form-controls rw-form-pills">
                        {field.options.map((option) => {
                          const on = pills[field.id] === option
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={on}
                              className={`rw-form-pill${on ? ' is-on' : ''}`}
                              onClick={() => setPill(field.id, option)}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {CHECK_GROUPS.map((group) => (
                    <div key={group.id} className="rw-form-field-wrap rw-form-field-wrap--wide">
                      <span className="rw-form-q-title">{group.title} <span className="rw-form-optional"> (optional)</span></span>
                      <div className="rw-form-controls rw-form-checks">
                        {group.options.map((option) => {
                          const on = checks[group.id].includes(option)
                          return (
                            <label key={option} className={`rw-form-check${on ? ' is-on' : ''}`}>
                              <input type="checkbox" checked={on} onChange={() => toggleCheck(group.id, option)} />
                              {option}
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  <label className="rw-form-field-wrap rw-form-field-wrap--wide" style={{ display: 'block' }}>
                    <span className="rw-form-q-title">Anything else we should know? <span className="rw-form-optional"> (optional)</span></span>
                    <textarea
                      className="rw-form-field"
                      rows={4}
                      style={{ marginTop: 10 }}
                      placeholder="A line about the network you bring"
                      value={values.notes || ''}
                      onChange={set('notes')}
                    />
                  </label>
                </div>

                {error && (
                  <p style={{ fontFamily: text, fontWeight: 300, fontSize: 14, color: 'var(--copper)', margin: 0 }}>{error}</p>
                )}

                <div className="rw-form-submit-bar">
                  <span className="rw-form-left">One application, no obligation to proceed.</span>
                  <button
                    type="submit"
                    className="rw-form-submit rw-cta rw-cta--live"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'SENDING…' : 'SUBMIT APPLICATION'} <span className="rw-cta-arrow" aria-hidden>→</span>
                  </button>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <ClosingCTA id="join" title="Put your buyer network in front of Hyderabad’s premium inventory.">
        <button type="button" onClick={() => scrollToId('apply')} className="rw-cta rw-cta--live" style={{ ...ctaCopper, background: 'var(--ink)', color: 'var(--bg)' }}>
          APPLY TO BECOME A CHANNEL PARTNER <span className="rw-cta-arrow" aria-hidden> →</span>
        </button>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}