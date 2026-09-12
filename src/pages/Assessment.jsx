import skylineImage from '../assets/site/skyline.png'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import ClosingCTA from '../components/ClosingCTA'
import SectionHead, { CenteredHead, SectionAside } from '../components/SectionHead'
import { BookButton } from '../components/BookingModal'
import { KRISAH_ASSESSMENT_URL } from '../data/content'
import { FOOTER_LINKS, mono, serif } from '../theme'
import {
  container, ctaCopper, ctaInline,
  eyebrow, note, sectionHeading, sectionRule, statLabel,
} from '../styles'

const HEADLINE = [
  { text: 'How ready are you ' },
  { br: true },
  { text: 'for the interview?', italic: true, copper: true },
]

const TRUST = ['FREE · NO OBLIGATION', 'SCORE REPORT INCLUDED', 'AI-POWERED · INSTANT RESULTS']

/* The before-test page. Running the interview on KRISAH's platform — this page only tees off. */
const STEPS = [
  { n: '01', title: 'Start here', body: 'Hit Start Assessment. The interview opens on KRISAH’s platform in a new tab. Nothing to install, no forms to fill before you begin.' },
  { n: '02', title: 'Interview with an AI', body: 'Twenty questions in about twenty-five minutes. Answer out loud, the way you would in the room. Delivery is part of what is being read.' },
  { n: '03', title: 'Get your scored report', body: 'The interview closes with a report scored across all six dimensions. An Interview Readiness Score, and where the gaps are.' },
  { n: '04', title: 'Return for your courses', body: 'Come back after the session. The coaching and consulting catalogue points you at what to work on next.' },
]

/* The six dimensions the AI interviewer scores — the same set behind every role. */
const AREAS = [
  { n: '01', title: 'What you know', line: 'Command of the market, the product, and what a serious buyer expects you to know before they trust you.' },
  { n: '02', title: 'How you structure answers', line: 'Clear, complete, and easy to follow. Never rambling, never hard to act on.' },
  { n: '03', title: 'How you communicate', line: 'Tone and professional presence. In high-value conversations, trust is decided early.' },
  { n: '04', title: 'How you carry yourself', line: 'Confidence under pressure. Does the delivery match the price point of what you represent?' },
  { n: '05', title: 'How relevant you stay', line: 'Answering what was asked rather than drifting. A buyer who repeats themselves is already disengaging.' },
  { n: '06', title: 'How you handle objections', line: 'The moment that separates closers from order-takers. Pushback, challenge, redirection.' },
]

/* Indicative sample report — replace with a real one once campaigns flow. */
const SAMPLE_BARS = [
  { label: 'Content', val: 84 },
  { label: 'Structure', val: 66 },
  { label: 'Communication', val: 76 },
  { label: 'Confidence', val: 72 },
  { label: 'Relevance', val: 60 },
  { label: 'Objections', val: 68 },
]

const FAQS = [
  { q: 'Who is this for?', a: 'Anyone interviewing with Rajiv Williams, at any role and any level. It is a readiness read, not a pass/fail gate.' },
  { q: 'How long does it take?', a: 'Twenty questions, about twenty-five minutes. Give yourself one uninterrupted sitting.' },
  { q: 'Do I get a report?', a: 'Yes. After the session you receive a scored report across all six dimensions, free and yours to keep. That is what makes the coaching follow-up specific instead of generic.' },
  { q: 'Where does the interview run?', a: 'On KRISAH’s platform, in a new tab. Nothing is installed, and no score is shared anywhere on this site.' },
]

export default function Assessment() {
  return (
    <>
      <Seo route="/assessment" />
      <Header />

      {/* Intro */}
      <PageIntro
        eyebrow="RAJIV WILLIAMS AI ASSESSMENT · POWERED BY KRISAH"
        headline={HEADLINE}
        lede="A 25-minute, 20-question AI interview before you meet us."
        intro="Answer the way you would in a real room. You finish with a clearer read on yourself; we get to see how you think under pressure. Any role, any stage of your career."
        cta={<>
          <a href={KRISAH_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" style={ctaCopper}>
            START ASSESSMENT →
          </a>
          <button type="button" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="rw-inline-cta" style={ctaInline}>
            See how it works →
          </button>
        </>}
        extra={
          <Reveal delay={120} style={{ marginTop: 48, borderTop: '1px solid var(--line)', paddingTop: 26 }}>
            <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: serif, fontSize: 'clamp(28px,3.4vw,34px)', color: 'var(--ink)' }}>20</div>
                <div style={{ ...statLabel, marginTop: 8 }}>QUESTIONS</div>
              </div>
              <div>
                <div style={{ fontFamily: serif, fontSize: 'clamp(28px,3.4vw,34px)', color: 'var(--ink)' }}>≈ 25 min</div>
                <div style={{ ...statLabel, marginTop: 8 }}>ONE SITTING</div>
              </div>
              <div>
                <div style={{ fontFamily: serif, fontSize: 'clamp(28px,3.4vw,34px)', color: 'var(--ink)' }}>AI</div>
                <div style={{ ...statLabel, marginTop: 8 }}>INTERVIEWER</div>
              </div>
            </div>
            <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)' }}>
              {TRUST.map((item) => <span key={item}>{item}</span>)}
            </div>
          </Reveal>
        }
      />

      {/* Team statement — "we" voice, RW Team; skyline photo lifted so the gold linework reads */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <img
          src={skylineImage}
          alt=""
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center bottom',
            opacity: 1,
          }}
        />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,9,.55) 0%, rgba(11,10,9,.22) 45%, rgba(11,10,9,.62) 100%)' }} />
        <div className="rw-pad" style={{ ...container, padding: 'clamp(64px,8vw,96px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrow, marginBottom: 16 }}>THE RW TEAM</Reveal>
          <Reveal as="p" style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,44px)', lineHeight: 1.12 }}>
            Before we coach you, we want you to know 
          </Reveal>
          <Reveal as="p" delay={120} style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,44px)', lineHeight: 1.12, fontStyle: 'italic', color: 'var(--copper)', marginTop: 12 }}>
            how you perform !
          </Reveal>
          <Reveal as="p" delay={200} style={{ ...note, marginTop: 20, marginLeft: 'auto', marginRight: 'auto', maxWidth: '32em', fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6, color: 'var(--ink)', textShadow: '0 1px 20px rgba(11,10,9,.6), 0 0 2px rgba(11,10,9,.8)' }}>
            Over fifteen years of high-value sales, the same lesson keeps repeating: the gap between a good professional and a great one is not knowledge. It is how they perform when it matters. The interview lets us measure that before we begin.
          </Reveal>
        </div>
      </section>

      {/* The session + how it runs — one section keeps the page tight */}
      <section id="how" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
            <Reveal className="rw-figure" style={{ border: '1px solid var(--line)', aspectRatio: '4/3' }}>
              <ImageSlot
                alt="A candidate answering the Rajiv Williams AI assessment on camera"
                placeholder="AI interview session"
                caption="The assessment"
                spec="Landscape 4:3 · ≥1600px wide · a candidate answering the AI interviewer on camera, calm and composed"
                tag="KRISAH AI"
              />
            </Reveal>
            <Reveal delay={120}>
              <div style={{ ...eyebrow, marginBottom: 16 }}>WHAT THE SESSION LOOKS LIKE</div>
              <h2 style={{ ...sectionHeading, fontSize: 'clamp(26px,3.2vw,40px)', lineHeight: 1.08 }}>
                A real interview. With a highly intelligent, purpose-trained AI.
              </h2>
              <p style={{ ...note, marginTop: 18, fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6 }}>
                Twenty questions from an AI interviewer engineered for this read. It waits, listens, and captures not just what you say, but how you structure, pace, and hold the answer.
              </p>
              <p style={{ ...note, marginTop: 14, fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6 }}>
                Answer out loud. Hesitate the way you would in the room. It is rehearsal under real pressure, and the only audience is you.
              </p>
            </Reveal>
          </div>

          {/* How it runs — the same rail as the Careers process; one track across desktop, vertical on a phone. */}
          <div style={{ marginTop: 'clamp(56px,7vw,88px)', paddingTop: 'clamp(44px,6vw,64px)', borderTop: '1px solid var(--line)' }}>
            <Reveal style={{ ...eyebrow, marginBottom: 16 }}>HOW IT RUNS</Reveal>
            <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
              Four steps. No prep.
            </Reveal>

            <div className="rw-track" style={{ marginTop: 'clamp(44px,6vw,72px)' }}>
              <div className="rw-track-steps">
                {STEPS.map((step, i) => (
                  <Reveal key={step.n} delay={i * 90} className="rw-track-step" style={{ textAlign: 'center' }}>
                    <div className="rw-track-node" style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.08em' }}>{step.n}</div>
                    <div>
                      <div style={{ marginTop: 22, fontFamily: serif, fontSize: 'clamp(21px,2.4vw,27px)', color: 'var(--ink)' }}>{step.title}</div>
                      <div style={{ ...note, marginTop: 8, marginLeft: 'auto', marginRight: 'auto', maxWidth: '22em', fontSize: 16, lineHeight: 1.5 }}>{step.body}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the report shows — six dimensions + a sample report card */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <SectionHead
            eyebrow="WHAT THE REPORT SHOWS" titleWidth="12em"
            title="Six dimensions, scored against the room."
            aside={<SectionAside>Scores 0–100 on each dimension and a single Interview Readiness Score you can watch move as you practise.</SectionAside>}
          />

          <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start', marginTop: 12 }}>
            <div>
              {AREAS.map((area, i) => (
                <Reveal key={area.n} delay={i * 50} style={{ display: 'flex', gap: 18, padding: '15px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: serif, fontSize: 'clamp(20px,2vw,24px)', color: 'var(--copper)', flexShrink: 0, width: '2em' }}>{area.n}</div>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: 'clamp(18px,2vw,22px)', color: 'var(--ink)' }}>{area.title}</div>
                    <div style={{ ...note, marginTop: 4, fontSize: 15, lineHeight: 1.5 }}>{area.line}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140} className="rw-figure">
              <div style={{ border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', position: 'relative' }}>
                <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
                <div style={{ padding: 'clamp(22px,3vw,32px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--copper)' }}>ASSESSMENT REPORT</div>
                      <div style={{ fontFamily: serif, fontSize: 17, color: 'var(--ink)', marginTop: 2 }}>Interview Readiness Score</div>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.1em', color: 'var(--faded)' }}>SAMPLE</div>
                  </div>

                  <div style={{ textAlign: 'center', margin: '20px 0 18px' }}>
                    <div style={{ fontFamily: serif, fontSize: 'clamp(48px,6vw,64px)', color: 'var(--copper)', lineHeight: 1 }}>71</div>
                    <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--faded)', marginTop: 6 }}>OUT OF 100</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {SAMPLE_BARS.map((bar) => (
                      <div key={bar.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.08em', color: 'var(--faded)' }}>{bar.label.toUpperCase()}</span>
                          <span style={{ fontFamily: mono, fontSize: 11, color: 'var(--copper)' }}>{bar.val}</span>
                        </div>
                        <div style={{ height: 2, background: 'var(--chip)', marginTop: 5 }}>
                          <div style={{ height: '100%', width: `${bar.val}%`, background: 'var(--gold-gradient)' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--copper)', flexShrink: 0 }} />
                    <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.06em', color: 'var(--faded)' }}>STRONGEST: CONTENT · PRIORITY: RELEVANCE</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What happens after */}
      <section className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(90px,11vw,130px) 40px' }}>
        <CenteredHead
          eyebrow="AFTER THE TEST"
          title={<><span style={{ color: 'var(--copper)' }}>Sixteen</span> courses, ninety minutes each.</>}
          intro="Return after your interview and find the coaching or consulting programme matched to the gaps the session exposed. Ninety to one hundred and twenty minutes, structured and specific."
        />

        <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 40, marginTop: 56 }}>
          <Reveal className="rw-figure" style={{ border: '1px solid var(--line)', padding: 'clamp(28px,4vw,44px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.14em', color: 'var(--copper)' }}>COACHING</div>
            <div>
              <div style={{ fontFamily: serif, fontSize: 'clamp(23px,2.6vw,29px)', color: 'var(--ink)' }}>Eight coaching courses</div>
              <div style={{ ...note, marginTop: 10, lineHeight: 1.5 }}>
                Foundations of high-value selling for individuals and teams, through to negotiating the close.
              </div>
            </div>
            <a href="/coaching" className="rw-inline-cta" style={{ ...ctaInline, marginTop: 'auto' }}>Explore coaching →</a>
          </Reveal>

          <Reveal delay={90} className="rw-figure" style={{ border: '1px solid var(--line)', padding: 'clamp(28px,4vw,44px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.14em', color: 'var(--copper)' }}>CONSULTING</div>
            <div>
              <div style={{ fontFamily: serif, fontSize: 'clamp(23px,2.6vw,29px)', color: 'var(--ink)' }}>Eight consulting courses</div>
              <div style={{ ...note, marginTop: 10, lineHeight: 1.5 }}>
                For developers and leadership: process audits, pricing, channel networks and mandate models.
              </div>
            </div>
            <a href="/consulting" className="rw-inline-cta" style={{ ...ctaInline, marginTop: 'auto' }}>Explore consulting →</a>
          </Reveal>
        </div>

        <Reveal delay={160} style={{ marginTop: 40, textAlign: 'center' }}>
          <a href="/assessment/result" className="rw-inline-cta" style={ctaInline}>See all sixteen courses →</a>
        </Reveal>
      </section>

      {/* FAQ */}
      <section style={{ ...sectionRule, background: 'var(--chip)', position: 'relative' }}>
        <div className="rw-pad" style={{ maxWidth: 880, margin: '0 auto', padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrow, marginBottom: 16 }}>QUESTIONS</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, marginBottom: 30 }}>Before you start.</Reveal>
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 70} style={{ borderTop: '1px solid var(--line)', padding: '24px 0' }}>
              <div style={{ fontFamily: serif, fontSize: 'clamp(18px,2vw,22px)', color: 'var(--ink)' }}>{faq.q}</div>
              <p style={{ ...note, marginTop: 8, lineHeight: 1.5 }}>{faq.a}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing — the offer */}
      <ClosingCTA title="Your first assessment is free." titleStyle={{ maxWidth: '15em' }}>
        <div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <a href={KRISAH_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" style={ctaCopper}>
              START ASSESSMENT →
            </a>
            <BookButton interest="Coaching" specular>OR BOOK A CALL FIRST</BookButton>
          </div>
          <p style={{ ...note, marginTop: 22, fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)' }}>
            FREE · NO OBLIGATION · SCORE REPORT INCLUDED · INSTANT RESULTS
          </p>
        </div>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}