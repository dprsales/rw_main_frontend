import { useCallback, useRef } from 'react'

/** Pulls an element toward the cursor while hovering, springs back on leave. Returns spreadable props. */
export function useMagnetic({ x = 0.28, y = 0.4 } = {}) {
  const ref = useRef(null)

  const onPointerMove = useCallback((ev) => {
    const el = ref.current
    if (!el) return
    const rc = el.getBoundingClientRect()
    const mx = ev.clientX - (rc.left + rc.width / 2)
    const my = ev.clientY - (rc.top + rc.height / 2)
    el.style.transform = `translate(${mx * x}px, ${my * y}px)`
  }, [x, y])

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0,0)'
  }, [])

  return {
    ref,
    onPointerMove,
    onPointerLeave,
    style: { transition: 'transform .3s cubic-bezier(.2,.7,.2,1)' },
  }
}
