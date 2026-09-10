/**
 * Intro section shared by Coaching, Consulting and Careers: eyebrow, RiseText h1, optional
 * lede/intro/CTA/extra. Realty and Portfolio use a different layout and are left alone.
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
}) {
  return (
    <section id="top" className="rw-pad" style={{ ...container, padding }}>
      <Reveal style={{ ...eyebrowToken, marginBottom: 30 }}>{eyebrow}</Reveal>

      <h1 style={{ ...pageHeading, maxWidth: '17em', ...headlineStyle }}>
        <RiseText lines={headline} step={headlineStep} />
      </h1>

      {lede && (
        <Reveal as="p" delay={140} style={{ ...ledeToken, marginTop: 28, ...ledeStyle }}>
          {lede}
        </Reveal>
      )}

      {intro && (
        <Reveal as="p" delay={180} style={{ ...introToken, marginTop: 16, maxWidth: '36em', ...introStyle }}>
          {intro}
        </Reveal>
      )}

      {cta && (
        <Reveal delay={240} style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {cta}
        </Reveal>
      )}

      {extra}
    </section>
  )
}
