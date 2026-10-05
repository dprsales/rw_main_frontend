/**
 * Shared shell for the legal pages. Same header, intro and footer as About and Contact.
 * Copy arrives as blocks. The draft-notes appendix is never passed in.
 */
import { Link } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import PageIntro from './PageIntro'
import Seo from './Seo'
import mark from '../assets/site/rw-logo-ccr.png'
import { FOOTER_LINKS, text } from '../theme'
import { fs, container, sectionRule } from '../styles'

const LEGAL_SWITCH = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms' },
]

function sectionId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Brand: Jost for counters, Cormorant for the title. "1. Who we are" splits that way. */
function splitHeading(title) {
  const match = String(title).match(/^(\d+(?:\.\d+)*)\.\s+(.*)$/)
  if (!match) return { num: null, rest: title }
  return { num: match[1], rest: match[2] }
}

const INLINE = /(\*\*[^*]+\*\*|\[to confirm[^\]]*\]|https:\/\/rajivwilliams\.com|connect@rajivwilliams\.com|\+91 95495 46568|Privacy Policy)/g

function Inline({ text, linkPrivacy }) {
  const nodes = []
  let last = 0
  let key = 0
  for (const match of text.matchAll(INLINE)) {
    const start = match.index
    const token = match[0]
    if (start > last) nodes.push(text.slice(last, start))
    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('[to confirm')) {
      nodes.push(<span key={key} className="rw-legal-confirm">{token}</span>)
    } else if (token.startsWith('https://')) {
      nodes.push(<a key={key} href={token}>{token}</a>)
    } else if (token.includes('@')) {
      nodes.push(<a key={key} href={`mailto:${token}`}>{token}</a>)
    } else if (token.startsWith('+91')) {
      nodes.push(<a key={key} href="tel:+919549546568">{token}</a>)
    } else if (linkPrivacy) {
      nodes.push(<Link key={key} to="/privacy-policy">{token}</Link>)
    } else {
      nodes.push(token)
    }
    key += 1
    last = start + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function Heading({ as: Tag, className, title, linkPrivacy, id }) {
  const { num, rest } = splitHeading(title)
  return (
    <Tag id={id} className={className}>
      {num && <span className="rw-legal-num">{num}</span>}
      <span className="rw-legal-h-title"><Inline text={num ? rest : title} linkPrivacy={linkPrivacy} /></span>
    </Tag>
  )
}

function Block({ block, linkPrivacy }) {
  if (block.k === 'h2') {
    return <Heading as="h2" className="rw-legal-h2" id={sectionId(block.t)} title={block.t} linkPrivacy={linkPrivacy} />
  }
  if (block.k === 'h3') {
    return <Heading as="h3" className="rw-legal-h3" title={block.t} linkPrivacy={linkPrivacy} />
  }
  if (block.k === 'ul') {
    return (
      <ul className="rw-legal-list">
        {block.items.map((item) => (
          <li key={item} style={{ fontFamily: text, fontSize: fs('clamp(16px,1.6vw,18px)') }}>
            <Inline text={item} linkPrivacy={linkPrivacy} />
          </li>
        ))}
      </ul>
    )
  }
  return (
    <p className="rw-legal-p" style={{ fontFamily: text, fontSize: fs('clamp(16px,1.6vw,18px)') }}>
      <Inline text={block.t} linkPrivacy={linkPrivacy} />
    </p>
  )
}

export default function LegalPage({ route, eyebrow, title, lede, blocks, linkPrivacy = false }) {
  const sections = blocks.filter((block) => block.k === 'h2')

  return (
    <>
      <Seo route={route} />
      <Header />
      <div className="rw-legal-page">
        <img src={mark} alt="" aria-hidden className="rw-legal-mark is-high" />
        <img src={mark} alt="" aria-hidden className="rw-legal-mark is-low" />
        <PageIntro
          eyebrow={eyebrow}
          headline={[{ text: title }]}
          lede={lede}
          extra={(
            <nav className="rw-legal-switch" aria-label="Legal pages">
              {LEGAL_SWITCH.map((item) => (
                <Link key={item.to} to={item.to} className={route === item.to ? 'is-active' : undefined}>
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        />
        <section style={{ ...sectionRule }}>
          <article className="rw-pad" style={{ ...container, padding: 'clamp(28px,4vw,48px) 40px clamp(80px,10vw,120px)' }}>
            <div className="rw-legal">
              <nav className="rw-legal-contents" aria-label="On this page">
                {sections.map((section) => {
                  const { num, rest } = splitHeading(section.t)
                  return (
                    <a key={section.t} href={`#${sectionId(section.t)}`}>
                      {num && <span className="rw-legal-num">{num}</span>}
                      {rest || section.t}
                    </a>
                  )
                })}
              </nav>
              {blocks.map((block, index) => (
                <Block key={`${block.k}-${index}`} block={block} linkPrivacy={linkPrivacy} />
              ))}
            </div>
          </article>
        </section>
      </div>
      <Footer links={FOOTER_LINKS} />
    </>
  )
}
