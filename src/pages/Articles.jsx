import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Gallery from '../components/Gallery'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import { fetchBlogsOnce } from '../data/blogs'
import { FOOTER_LINKS, mono } from '../theme'
import { fs, container, note } from '../styles'

const withRhythm = (posts) => posts.map((post, i) => ({ ...post, wide: i % 5 === 0 }))

export default function Articles() {
  const [items, setItems] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetchBlogsOnce()
      .then((cards) => { if (alive) setItems(withRhythm(cards)) })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [])

  return (
    <>
      <Seo route="/articles" />
      <Header />

      <PageIntro
        eyebrow="ARTICLES"
        headline={[{ text: 'Readings from a live market.' }]}
        lede="Writing on luxury sales, teams, and mandates. Open any post to read it."
      />

      <section className="rw-pad" style={{ ...container, padding: '10px 40px var(--rw-sy-lg)' }}>
        {failed && (
          <p style={{ ...note, fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em' }}>
            The articles could not be loaded. Try again in a moment.
          </p>
        )}
        {items && items.length > 0 && <Gallery items={items} />}
        {items && items.length === 0 && (
          <p style={{ ...note, fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em' }}>
            No articles yet.
          </p>
        )}
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
