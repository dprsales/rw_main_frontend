import { useCallback, useEffect, useState } from 'react'
import ImageSlot from './ImageSlot'
import Reveal from './Reveal'
import { mono, serif, text } from '../theme'

// Responsive image gallery with a lightbox (arrow keys move, Esc closes).
export default function Gallery({ items }) {
  const [open, setOpen] = useState(null)

  const close = useCallback(() => setOpen(null), [])
  const move = useCallback(
    (dir) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') move(1)
      else if (e.key === 'ArrowLeft') move(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, move])

  const active = open === null ? null : items[open]

  return (
    <>
      <div className="rw-gallery">
        {items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={(i % 3) * 80}
            className={`rw-figure${item.wide ? ' rw-figure-wide' : ''}`}
            {...(item.href
              ? { as: 'a', href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : { as: 'button', type: 'button', onClick: () => setOpen(i) })}
            style={{
              display: 'block', textAlign: 'left', border: '1px solid var(--line)',
              background: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink)', overflow: 'hidden',
              textDecoration: 'none',
            }}
          >
            <div style={{ aspectRatio: item.wide ? '16/9' : '4/3', position: 'relative' }}>
              <ImageSlot src={item.src} alt={item.title} placeholder={item.placeholder || 'Photo'} spec={item.spec} tag={item.tag} />
            </div>
            <div style={{ padding: '18px 20px 22px', borderTop: '1px solid var(--line)' }}>
              <div style={{ fontFamily: serif, fontSize: 19, lineHeight: 1.2, color: 'var(--ink)' }}>{item.title}</div>
              {item.meta && (
                <div style={{ marginTop: 8, fontFamily: mono, fontSize: 11, letterSpacing: '.1em', color: 'var(--faded)' }}>
                  {item.meta}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          className="rw-lightbox"
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(8,6,4,.9)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            // overflowY + margin:auto centering lets tall content scroll instead of clipping
            display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: 'clamp(12px,4vw,24px)',
          }}
        >
          <button
            type="button" className="rw-lb-btn" onClick={close} aria-label="Close"
            style={{ position: 'absolute', top: 'clamp(12px,2.4vw,22px)', right: 'clamp(12px,2.4vw,22px)', width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', fontSize: 20 }}
          >
            ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(1000px, 92vw)', margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}
          >
            <div style={{ aspectRatio: active.wide ? '16/9' : '3/2', width: '100%', border: '1px solid rgba(255,255,255,.14)', overflow: 'hidden', background: '#0B0A09' }}>
              <ImageSlot src={active.src} alt={active.title} placeholder={active.placeholder || 'Photo'} tag={active.tag} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '40em' }}>
                {active.meta && <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--copper)', marginBottom: 8 }}>{active.meta}</div>}
                <div style={{ fontFamily: serif, fontSize: 'clamp(20px,2.6vw,30px)', lineHeight: 1.15, color: '#fff', maxWidth: '20em' }}>{active.title}</div>
                {active.desc && <p style={{ marginTop: 14, fontFamily: text, fontWeight: 300, fontSize: 16, lineHeight: 1.55, color: 'rgba(255,255,255,.72)' }}>{active.desc}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)' }}>
                  {String(open + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
                <button type="button" className="rw-lb-btn" onClick={() => move(-1)} aria-label="Previous"
                  style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', fontSize: 18 }}>←</button>
                <button type="button" className="rw-lb-btn" onClick={() => move(1)} aria-label="Next"
                  style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', fontSize: 18 }}>→</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
