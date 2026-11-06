import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { KRISAH_ASSESSMENT_URL } from '../data/content'
import { getErrorMessage } from '../data/api'
import { isValidPhone, submitAssessmentStart } from '../data/booking'
import { track } from '../data/analytics'
import { mono, serif, text } from '../theme'
import { ctaCopper, fs } from '../styles'
import CtaButton from './CtaButton'
import { useLang } from '../i18n/LangProvider'

export default function AssessmentStartModal({ location, onClose }) {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape' && !sending) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, sending])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError(t('assess.modal.errName'))
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError(t('assess.modal.errEmail'))
      return
    }
    if (!isValidPhone(phone)) {
      setError(t('assess.modal.errPhone'))
      return
    }
    setSending(true)
    setError('')
    try {
      await submitAssessmentStart({ name, email, phone, website, location })
      track('krisah_assessment_start', { location, gated: true })
      window.location.assign(KRISAH_ASSESSMENT_URL)
    } catch (err) {
      setSending(false)
      const message = getErrorMessage(err)
      setError(Array.isArray(message) ? message.join(' ') : message)
    }
  }

  const target = document.getElementById('rw-app-shell') || document.body

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rw-assessment-start-title"
      onClick={() => { if (!sending) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(6,5,4,.78)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px,4vw,24px)',
      }}
    >
      <form
        className="rw-modal-card"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          position: 'relative', width: 'min(480px, 100%)', overflowY: 'auto',
          background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 4,
          boxShadow: 'var(--shadow-lift)', padding: 'clamp(26px, 4vw, 40px)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={sending}
          aria-label={t('assess.modal.close')}
          style={{
            position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: '50%',
            border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)',
            fontSize: fs('17px'), cursor: 'pointer', lineHeight: 1,
          }}
        >
          ×
        </button>
        <p style={{ fontFamily: mono, fontSize: fs('15px'), letterSpacing: '.22em', color: 'var(--copper)', marginBottom: 12, paddingRight: 44 }}>
          {t('assess.modal.kicker')}
        </p>
        <h2 id="rw-assessment-start-title" style={{ fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', fontSize: fs('clamp(24px,3.2vw,32px)'), color: 'var(--ink)', lineHeight: 1.15, marginBottom: 8 }}>
          {t('assess.modal.title')}
        </h2>
        <p style={{ fontFamily: text, fontWeight: 300, fontSize: fs('14px'), lineHeight: 1.6, color: 'var(--faded)', marginBottom: 22 }}>
          {t('assess.modal.body')}
        </p>
        <div style={{ display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 7 }}>
            <span style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.12em', color: 'var(--faded)' }}>
              {t('assess.modal.name')} <span style={{ color: 'var(--copper)' }}>*</span>
            </span>
            <input ref={nameRef} required value={name} onChange={(event) => setName(event.target.value)} style={inputStyle} placeholder={t('assess.modal.namePh')} autoComplete="name" />
          </label>
          <label style={{ display: 'grid', gap: 7 }}>
            <span style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.12em', color: 'var(--faded)' }}>
              {t('assess.modal.email')} <span style={{ color: 'var(--copper)' }}>*</span>
            </span>
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} placeholder={t('assess.modal.emailPh')} autoComplete="email" />
          </label>
          <label style={{ display: 'grid', gap: 7 }}>
            <span style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.12em', color: 'var(--faded)' }}>
              {t('assess.modal.phone')} <span style={{ color: 'var(--copper)' }}>*</span>
            </span>
            <input required type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value)} style={inputStyle} placeholder={t('assess.modal.phonePh')} autoComplete="tel" />
          </label>
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
          />
        </div>
        {error && (
          <p role="alert" style={{ fontFamily: text, fontSize: fs('13px'), color: 'var(--copper)', marginTop: 14 }}>{error}</p>
        )}
        <CtaButton live type="submit" disabled={sending} style={{ ...ctaCopper, width: '100%', marginTop: 22 }}>
          {sending ? t('assess.modal.saving') : <>{t('assess.modal.go')} <span className="rw-cta-arrow">→</span></>}
        </CtaButton>
      </form>
    </div>,
    target,
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--bg)',
  border: '1px solid var(--line)',
  borderRadius: 2,
  color: 'var(--ink)',
  fontFamily: text,
  fontWeight: 300,
  fontSize: fs('16px'),
  padding: '12px 14px',
  outline: 'none',
}
