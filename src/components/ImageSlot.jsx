import { mono } from '../theme'

/** Renders an image, or a designed cross-hatched placeholder that looks intentional until `src` lands. */
export default function ImageSlot({
  src,
  alt = '',
  placeholder = 'Image',
  caption,
  spec,
  tag,
  fit = 'cover',
  position = 'center',
  rounded = false,
}) {
  const radius = rounded ? 4 : 0

  if (src) {
    const image = (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: fit, objectPosition: position, display: 'block', borderRadius: radius }}
      />
    )

    /* Once a real photo lands, the frame is clean - no corner label. */
    return image
  }

  return (
    <div
      className="rw-slot"
      style={{
        position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
        display: 'grid', placeItems: 'center', background: 'var(--chip)', borderRadius: radius,
      }}
    >
      {/* Cross-hatch so an empty frame still has texture */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, opacity: 0.6,
          backgroundImage: 'repeating-linear-gradient(45deg, var(--line) 0, var(--line) 1px, transparent 1px, transparent 13px)',
        }}
      />

      {tag && (
        <span
          style={{
            position: 'absolute', top: 14, left: 14, zIndex: 2,
            fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--faded)',
          }}
        >
          {tag}
        </span>
      )}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 20, maxWidth: '80%' }}>
        <div
          className="rw-slot-mark"
          style={{
            width: 46, height: 46, margin: '0 auto 16px', display: 'grid', placeItems: 'center',
            border: '1px solid var(--line)', borderRadius: '50%',
            color: 'var(--copper)', fontSize: 18,
            transition: 'transform .5s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          ✦
        </div>
        <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)', textTransform: 'uppercase' }}>
          {placeholder}
        </div>
        {caption && (
          <div style={{ marginTop: 8, fontFamily: mono, fontSize: 9, letterSpacing: '.1em', color: 'var(--faded)', opacity: 0.7 }}>
            {caption}
          </div>
        )}
        {/* The brief for whoever shoots or sources this frame. */}
        {spec && (
          <div
            style={{
              marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--line)',
              fontFamily: mono, fontSize: 9, lineHeight: 1.6, letterSpacing: '.06em', color: 'var(--copper)',
            }}
          >
            NEEDS: {spec}
          </div>
        )}
      </div>
    </div>
  )
}
