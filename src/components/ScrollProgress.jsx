import { useEffect, useRef } from 'react'

/** Copper bar across the top of the viewport, scaled to scroll depth. */
export default function ScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    let raf = null

    const update = () => {
      raf = null
      const el = ref.current
      if (!el) return
      const top = window.scrollY || document.documentElement.scrollTop || 0
      const height = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${height > 0 ? Math.min(1, top / height) : 0})`
    }

    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', top: 0, left: 0, height: 3, width: '100%',
        transformOrigin: 'left center', transform: 'scaleX(0)',
        background: 'var(--copper)', zIndex: 60,
      }}
    />
  )
}
