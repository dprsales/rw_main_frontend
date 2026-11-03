import { useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Seo from '../../components/Seo'
import { FOOTER_LINKS } from '../../theme'

/** Wraps every listing page in the site's own header/footer and the scoped Tailwind root.
 *  listings.css is loaded once from main.jsx. */
export default function ListingsShell({ title, description, noindex, children, footer = true }) {
  // Publish the (sticky, variable-height) site header height so sticky bars sit right below it.
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return undefined
    const set = () => document.documentElement.style.setProperty('--rw-header-h', `${Math.round(header.getBoundingClientRect().height)}px`)
    set()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(set) : null
    ro?.observe(header)
    window.addEventListener('resize', set)
    return () => { ro?.disconnect(); window.removeEventListener('resize', set) }
  }, [])

  return (
    <>
      <Seo title={title} description={description} noindex={noindex} />
      <Header />
      <div className="sy-root">{children}</div>
      {footer && <Footer chip links={FOOTER_LINKS} />}
    </>
  )
}
