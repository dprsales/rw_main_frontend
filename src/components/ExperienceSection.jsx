import { useEffect, useMemo, useRef, useState } from 'react'
import Reveal from './Reveal'
import { EXPERIENCE, EXPERIENCE_PHASES } from '../data/content'
import { mono, serif, text } from '../theme'
import { container, eyebrowFaded, sectionHeading, sectionRule } from '../styles'

/**
 * Tracks which phase block crosses viewport centre, so the pinned column shows reading position.
 * rootMargin narrows the trigger to a thin centre band instead of the bottom edge.
 */
function useActivePhase(keys) {
  const [active, setActive] = useState(keys[0])
  const refs = useRef({})

  useEffect(() => {
    const nodes = keys.map((k) => refs.current[k]).filter(Boolean)
    if (nodes.length === 0 || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.dataset.phase)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [keys])

  return [active, refs]
}

/** Career track — Dell through PVR Developers to the independent practice today. */
export default function ExperienceSection() {
  const phaseKeys = useMemo(() => EXPERIENCE_PHASES.map((p) => p.key), [])
  const [activePhase, phaseRefs] = useActivePhase(phaseKeys)

  return (
    <section id="experience" style={{ ...sectionRule, background: 'var(--chip)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
        <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.34fr .66fr', gap: 48 }}>
          {/* Pinned while the track scrolls past — the heading stays as context. */}
          <div className="rw-sticky-aside">
            <Reveal style={{ ...eyebrowFaded, marginBottom: 18 }}>THE TRACK</Reveal>
            <Reveal as="h2" delay={80} style={{ ...sectionHeading, fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1.05, maxWidth: '11em' }}>
              Fifteen years, from the call floor to the boardroom.
            </Reveal>
            <Reveal as="p" delay={140} style={{ marginTop: 22, fontFamily: text, fontWeight: 300, fontSize: 17, lineHeight: 1.6, color: 'var(--faded)', maxWidth: '26em' }}>
              A path that runs from enterprise operations through developer sales leadership into independent mentoring and mandate work.
            </Reveal>
            {/* Decorative — phase headings already carry these labels to the reader. */}
            <Reveal aria-hidden delay={200} style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid var(--line)' }}>
              {EXPERIENCE_PHASES.map((phase) => {
                const on = phase.key === activePhase
                return (
                  <div key={phase.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' }}>
                    <span
                      style={{
                        height: 1, flexShrink: 0, background: on ? 'var(--copper)' : 'var(--line)',
                        width: on ? 26 : 12,
                        transition: 'width .45s cubic-bezier(.2,.75,.25,1), background .45s',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
                        color: on ? 'var(--copper)' : 'var(--faded)',
                        opacity: on ? 1 : .6, transition: 'color .45s, opacity .45s',
                      }}
                    >
                      {phase.label}
                    </span>
                  </div>
                )
              })}
            </Reveal>

            {/* Stated once here rather than repeated on all thirteen rows. */}
            <Reveal delay={240} style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)', fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)' }}>
              ALL ROLES · HYDERABAD, INDIA
            </Reveal>
          </div>

          {/* Full-height spine with phase markers, so the eye reads one descent, not equal-weight rows. */}
          <div style={{ position: 'relative', paddingLeft: 28 }}>
            <div aria-hidden style={{ position: 'absolute', left: 3, top: 10, bottom: 10, width: 1, background: 'var(--line)' }} />

            {EXPERIENCE_PHASES.map((phase, p) => {
              const roles = EXPERIENCE.filter((r) => r.phase === phase.key)
              if (roles.length === 0) return null

              return (
                <div
                  key={phase.key}
                  ref={(el) => { phaseRefs.current[phase.key] = el }}
                  data-phase={phase.key}
                  style={{ position: 'relative', paddingBottom: p === EXPERIENCE_PHASES.length - 1 ? 0 : 44 }}
                >
                  <Reveal delay={p * 70}>
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute', left: -28, top: 5, width: 7, height: 7, borderRadius: '50%',
                        background: p === 0 ? 'var(--copper)' : 'var(--faded)',
                        boxShadow: p === 0 ? '0 0 0 4px rgba(195,155,83,.16)' : 'none',
                      }}
                    />
                    <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: p === 0 ? 'var(--copper)' : 'var(--ink)' }}>
                      {phase.label}
                    </div>
                    <div style={{ marginTop: 5, fontFamily: text, fontWeight: 300, fontSize: 13, color: 'var(--faded)' }}>{phase.note}</div>
                  </Reveal>

                  <div
                    className={phase.dense ? 'rw-grid-2' : undefined}
                    style={{
                      marginTop: 16,
                      ...(phase.dense
                        ? { display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 32 }
                        : {}),
                    }}
                  >
                    {roles.map((role, i) => (
                      <Reveal
                        key={role.company}
                        delay={p * 70 + (i % 4) * 45}
                        style={{ borderTop: '1px solid var(--line)', padding: phase.dense ? '13px 0' : '16px 0' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: serif, fontSize: phase.dense ? 16 : 21, color: 'var(--ink)' }}>{role.company}</span>
                          {role.current && (
                            <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.12em', color: 'var(--copper)', border: '1px solid var(--copper)', borderRadius: 100, padding: '3px 9px' }}>
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: 5, fontFamily: mono, fontSize: phase.dense ? 11 : 12, letterSpacing: '.04em', color: 'var(--faded)' }}>
                          {role.role}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
