import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import PageIntro from '../components/PageIntro'
import BorderGlow from '../components/BorderGlow'
import { getErrorMessage, submitVendorPartner } from '../data/api'
import { FOOTER_LINKS, serif, WHATSAPP } from '../theme'
import { ctaCopper, eyebrow, fs, note, sectionHeading, sectionRule } from '../styles'
import '../form/form.css'

const HEADLINE = [
  { text: 'Tell us about ' },
  { text: 'your business.', italic: true, copper: true },
]

const INDUSTRIES = [
  'Advertising', 'Animation', 'Architects', 'Bags', 'Content', 'Customized Chocolates',
  'Deep Cleaning', 'Digital Marketing', 'Drone Shots', 'E-commerce', 'Ethnic Clothing',
  'Event Managers', 'Food Catering', 'Furniture', 'Gifting', 'Graphic', 'HVAC',
  'Interior', 'LED Screening', 'Landscaping', 'MEP', 'Merchandising', 'Podcast',
  'Printers', 'SEO', 'Sign Boards', 'Software', 'Solar', 'Stall Fabricators',
  'Stationery', 'Swimming Pool', 'UPVC and Glass', 'Walkthrough', 'Website',
  'Welcome Kits', 'WordPress',
]

const FORM_GLOW = {
  backgroundColor: 'var(--card)',
  glowColor: '41 82 71',
  colors: ['#C39B53', '#E8C97A', '#A67C3D'],
  borderRadius: 4,
  glowRadius: 18,
  fillOpacity: 0.16,
  animated: false,
}

const FIELDS = [
  { title: 'Company', id: 'companyName', required: true, placeholder: 'The business name' },
  { title: 'Your name', id: 'contactName', required: true, placeholder: 'Who we should speak to' },
  { title: 'Phone', id: 'phone', required: true, type: 'tel', placeholder: '+91 ·····' },
  { title: 'Email', id: 'email', required: false, type: 'email', placeholder: 'you@company.com' },
  { title: 'City', id: 'city', required: false, placeholder: 'Hyderabad' },
  { title: 'Website or portfolio', id: 'websiteUrl', required: false, placeholder: 'https://' },
  { title: 'Video link', id: 'videoUrl', required: false, placeholder: 'A demo, reel, or walkthrough' },
]

function FileDrop({ title, hint, required, accept, file, onSelect, imageOnly }) {
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreviewUrl('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const acceptFile = (candidate) => {
    if (!candidate) return
    if (candidate.size > 8 * 1024 * 1024) {
      setLocalError('That file is over 8MB. Please attach a smaller one.')
      return
    }
    if (imageOnly && !candidate.type.startsWith('image/')) {
      setLocalError('Use a JPG, PNG, or WEBP image.')
      return
    }
    setLocalError('')
    onSelect(candidate)
  }

  return (
    <div className="rw-form-field-wrap">
      <span className="rw-form-q-title">
        {title}
        {required ? <span className="rw-form-req"> *</span> : <span className="rw-form-optional"> (optional)</span>}
      </span>
      {file ? (
        <div className="rw-file-preview" style={{ marginTop: 10 }}>
          {previewUrl
            ? <img className="rw-file-preview-image" src={previewUrl} alt="" />
            : <span className="rw-file-preview-icon" aria-hidden>PDF</span>}
          <span className="rw-file-preview-meta">
            <strong>{file.name}</strong>
            <small>{(file.size / 1024).toFixed(0)} KB</small>
          </span>
          <button type="button" className="rw-file-remove" onClick={() => onSelect(null)} aria-label={`Remove ${file.name}`}>×</button>
        </div>
      ) : (
        <label
          className={`rw-resume-dropzone${dragOver ? ' rw-resume-dropzone--over' : ''}`}
          style={{ marginTop: 10 }}
          onDragOver={(event) => { event.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => { event.preventDefault(); setDragOver(false); acceptFile(event.dataTransfer.files?.[0]) }}
        >
          <span>{hint}</span>
          <small>or click to browse · max 8MB</small>
          <input type="file" accept={accept} onChange={(event) => { acceptFile(event.target.files?.[0]); event.target.value = '' }} />
        </label>
      )}
      {localError && <span className="rw-form-help" style={{ marginTop: 8, color: 'var(--copper)' }}>{localError}</span>}
    </div>
  )
}

export default function VendorPartner() {
  const [values, setValues] = useState({ industry: '' })
  const [profileImage, setProfileImage] = useState(null)
  const [brochure, setBrochure] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const honeypot = useRef(null)

  const set = (id) => (event) => setValues((current) => ({ ...current, [id]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    if (honeypot.current?.value) {
      setStatus('done')
      return
    }
    if (!profileImage) {
      setError('Add a profile image of you or the business.')
      return
    }
    if (!values.industry?.trim()) {
      setError('Tell us what the business supplies.')
      return
    }
    if ((values.about || '').trim().length < 10) {
      setError('Write a short note about the business.')
      return
    }

    const body = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (String(value || '').trim()) body.append(key, String(value).trim())
    })
    body.append('profileImage', profileImage)
    if (brochure) body.append('brochure', brochure)
    if (honeypot.current?.value) body.append('website_hp', honeypot.current.value)

    setStatus('sending')
    setError('')
    try {
      await submitVendorPartner(body)
      setStatus('done')
    } catch (err) {
      setStatus('idle')
      const message = getErrorMessage(err)
      setError(Array.isArray(message) ? message.join(' ') : message)
    }
  }

  return (
    <>
      <Seo route="/vendorpartner" />
      <Header />
      <PageIntro
        eyebrow="VENDOR PARTNER"
        headline={HEADLINE}
        lede="Share a profile photo, what you offer, and a link to the work. The team reviews every submission from this page."
      />

      <section style={{ ...sectionRule, background: 'var(--chip)', borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ maxWidth: 860, margin: '0 auto', padding: 'var(--rw-sy) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>YOUR BUSINESS</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, marginTop: 16 }}>
            The details we keep on file.
          </Reveal>

          {status === 'done' ? (
            <Reveal delay={100} style={{ textAlign: 'center', paddingTop: 'clamp(44px,6vw,66px)' }}>
              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: fs('clamp(24px,3vw,32px)'), color: 'var(--ink)', marginTop: 8 }}>
                Received.
              </h3>
              <p style={{ ...note, marginTop: 14, marginLeft: 'auto', marginRight: 'auto', maxWidth: '32em' }}>
                The team will look through what you sent. If there is a fit, someone will be in touch.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <a className="rw-cta" style={{ ...ctaCopper }} href={WHATSAPP} target="_blank" rel="noreferrer">
                  WHATSAPP THE TEAM
                </a>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={140}>
              <form onSubmit={handleSubmit} style={{ marginTop: 'clamp(28px,4vw,42px)' }}>
                <input
                  ref={honeypot}
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                />
                <BorderGlow {...FORM_GLOW} className="rw-form-glow">
                  <div className="rw-form-panel rw-form-panel--compact rw-form-panel--glow">
                  <FileDrop
                    title="Profile image"
                    hint="Drop a photo of you or the business"
                    required
                    accept=".jpg,.jpeg,.png,.webp"
                    file={profileImage}
                    onSelect={setProfileImage}
                    imageOnly
                  />
                  {FIELDS.map((field) => (
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
                  <label className="rw-form-field-wrap" style={{ display: 'block' }}>
                    <span className="rw-form-q-title">What you supply <span className="rw-form-req"> *</span></span>
                    <input
                      className="rw-form-field"
                      list="vendor-industries"
                      style={{ marginTop: 10 }}
                      required
                      placeholder="Interior, printing, catering…"
                      value={values.industry || ''}
                      onChange={set('industry')}
                    />
                    <datalist id="vendor-industries">
                      {INDUSTRIES.map((name) => <option key={name} value={name} />)}
                    </datalist>
                  </label>
                  <label className="rw-form-field-wrap rw-form-field-wrap--wide" style={{ display: 'block' }}>
                    <span className="rw-form-q-title">About the business <span className="rw-form-req"> *</span></span>
                    <textarea
                      className="rw-form-field"
                      style={{ marginTop: 10, minHeight: 120 }}
                      required
                      minLength={10}
                      placeholder="What you make or offer, and who it is for."
                      value={values.about || ''}
                      onChange={set('about')}
                    />
                  </label>
                  <FileDrop
                    title="Brochure"
                    hint="Drop a PDF or image"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    file={brochure}
                    onSelect={setBrochure}
                  />
                  </div>
                </BorderGlow>
                {error && (
                  <p style={{ ...note, color: 'var(--copper)', marginTop: 16 }}>{error}</p>
                )}
                <button className="rw-cta" style={{ ...ctaCopper, marginTop: 28 }} type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'SENDING…' : 'SEND DETAILS'}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>
      <Footer links={FOOTER_LINKS} />
    </>
  )
}
