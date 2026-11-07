/**
 * Shared page intro with optional copy, actions and a right-hand illustration.
 */
import Reveal from './Reveal'
import RiseText from './RiseText'
import { container, eyebrow as eyebrowToken, intro as introToken, lede as ledeToken, pageHeading } from '../styles'

export default function PageIntro({
  eyebrow,
  headline,
  headlineStep = 0.1,
  headlineStyle,
  lede,
  ledeStyle,
  intro,
  introStyle,
  cta,
  extra,
  padding = '80px 40px 30px',
  image,
  imageAlt = '',
}) {
  return (
    <section
      id="top"
      className={`rw-pad rw-page-intro${image ? ' rw-intro-with-image' : ''}`}
      style={{ ...container, padding }}
    >
      <div className="rw-intro-copy">
        <Reveal style={{ ...eyebrowToken, marginBottom: 30 }}>{eyebrow}</Reveal>

        <h3 className="rw-page-intro-title" style={{ ...pageHeading, maxWidth: '17em', ...headlineStyle }}>
          <RiseText lines={headline} step={headlineStep} />
        </h3>

        {lede && (
          <Reveal as="p" className="rw-page-intro-lede" delay={140} style={{ ...ledeToken, marginTop: 28, ...ledeStyle }}>
            {lede}
          </Reveal>
        )}

        {intro && (
          <Reveal as="p" className="rw-page-intro-body" delay={180} style={{ ...introToken, marginTop: 16, maxWidth: '36em', ...introStyle }}>
            {intro}
          </Reveal>
        )}

        {cta && (
          <Reveal delay={240} style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {cta}
          </Reveal>
        )}

        {extra}
      </div>

      {image && (
        <div className="rw-intro-visual">
          <img src={image} alt={imageAlt} className="rw-intro-image" />
        </div>
      )}
    </section>
  )
}
